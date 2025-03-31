import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonToast,
  useIonRouter,
  IonLoading,
  IonModal,
} from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');

  const getUserByEmail = async (email: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (error || !data) return null;
    return data.id;
  };

  const getFailedLoginData = async (userId: string) => {
    const { data, error } = await supabase
      .from('failed_logins')
      .select('failed_attempts, last_attempt, locked_until')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  };

  const lockAccount = async (userId: string, lockDuration: number) => {
    const nowUTC = new Date();
    nowUTC.setMinutes(nowUTC.getMinutes() + lockDuration);

    await supabase
      .from('failed_logins')
      .update({ locked_until: nowUTC.toISOString() })
      .eq('user_id', userId);
  };

  const isAccountLocked = async (userId: string) => {
    const { data, error } = await supabase
      .from('failed_logins')
      .select('locked_until')
      .eq('user_id', userId)
      .single();

    if (error || !data || !data.locked_until) return false;

    const lockedUntilUTC = new Date(data.locked_until);
    const nowUTC = new Date();

    return nowUTC < lockedUntilUTC
      ? `Your account is locked until ${lockedUntilUTC.toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}.`
      : false;
  };

  const trackFailedLogin = async (userId: string) => {
    const { data: failedData, error } = await supabase
      .from('failed_logins')
      .select('failed_attempts, locked_until')
      .eq('user_id', userId)
      .single();

    let attempts = failedData?.failed_attempts || 0;
    let lockDuration = 0;
    let errorMessage = 'Invalid email or password. Please try again.';

    attempts += 1;

    if (attempts === 3) {
      lockDuration = 5;
      errorMessage = "Too many failed attempts. Your account is locked for 5 minutes.";
    } else if (attempts === 5) {
      lockDuration = 10;
      errorMessage = "Too many failed attempts. Your account is locked for 10 minutes.";
    }

    let lockedUntil = null;
    if (lockDuration > 0) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + lockDuration);
      lockedUntil = now.toISOString();
    }

    await supabase
      .from('failed_logins')
      .upsert([
        { user_id: userId, failed_attempts: attempts, last_attempt: new Date().toISOString(), locked_until: lockedUntil }
      ]);

    setToastMessage(errorMessage);
    setShowToast(true);
  };


  const resetFailedAttempts = async (userId: string) => {
    await supabase
      .from('failed_logins')
      .update({ failed_attempts: 0, locked_until: null })
      .eq('user_id', userId);
  };

  const verifyOTP = async () => {
    if (!otp) {
      setToastMessage("Please enter OTP.");
      setShowToast(true);
      return;
    }

    const { data, error } = await supabase
      .from('otp_codes')
      .select('id')
      .eq('user_id', userId)
      .eq('otp', otp)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      setToastMessage("Invalid or expired OTP.");
      setShowToast(true);
      return;
    }

    await supabase.from('otp_codes').delete().eq('id', data.id);
    setToastMessage("✅ Login successful!");
    setShowToast(true);
    setShowOTPModal(false);

    navigation.push("/it35b-lab/app");
  };

  const doLogin = async () => {
    setShowToast(false);
    setLoading(true);

    if (email.trim() === '' || password.trim() === '') {
      setToastMessage('Please enter your email and password.');
      setShowToast(true);
      setLoading(false);
      return;
    }

    if (!email.endsWith('@nbsc.edu.ph')) {
      setTimeout(() => {
        setLoading(false);
        setToastMessage('Invalid email or password. Please try again.');
        setShowToast(true);
      }, 1000);

      return;
    }

    try {
      const foundUserId = await getUserByEmail(email);
      if (!foundUserId) {
        setToastMessage('User not found. Please register.');
        setShowToast(true);
        setLoading(false);
        return;
      }

      setUserId(foundUserId);

      const { data: lockData, error: lockError } = await supabase
        .from('failed_logins')
        .select('locked_until')
        .eq('user_id', foundUserId)
        .single();

      if (lockData?.locked_until) {
        const lockedUntil = new Date(lockData.locked_until);
        const now = new Date();

        if (now < lockedUntil) {
          setToastMessage('Your account is locked. Try again later.');
          setShowToast(true);
          setLoading(false);
          return;
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error || !data.user) {
        await trackFailedLogin(foundUserId);
        setToastMessage('Invalid email or password. Please try again.');
        setShowToast(true);
        setLoading(false);
        return;
      }

      await resetFailedAttempts(foundUserId);

      const response = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (!result.success) {
        setToastMessage(result.error || "Failed to send OTP.");
        setShowToast(true);
        setLoading(false);
        return;
      }

      console.log("OTP sent to email.");

      setShowOTPModal(true);
    } catch (err) {
      setToastMessage((err as Error).message);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="dark-toolbar">
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding dark-theme" fullscreen>
        <div className="login-wrapper">
          <div className="login-container">
            <h2>Welcome</h2>
            <p>Please login to continue</p>

            <IonItem className="input-field">
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput type="email" value={email} onIonInput={(e) => setEmail(e.detail.value!)} placeholder="Enter your email" />
            </IonItem>

            <IonItem className="input-field">
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput
                type={showPassword ? 'text' : 'password'}
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
                placeholder="Enter your password"
              />
              <IonButton fill="clear" slot="end" className="eye-button" onClick={() => setShowPassword(!showPassword)}>
                <IonIcon icon={showPassword ? eyeOff : eye} />
              </IonButton>
            </IonItem>

            <IonButton expand="full" className="login-btn" onClick={doLogin} disabled={!email || !password}>
              LOGIN
            </IonButton>


            <p className="register-link">
              Don't have an account?  <br />
              <IonButton fill="clear" className="register-btn" onClick={() => navigation.push('/it35b-lab/register')}>
                Sign up
              </IonButton>
            </p>
          </div>
        </div>

        <IonModal isOpen={showOTPModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Enter OTP</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <p>We sent a One-Time Password to your email.</p>
            <IonItem>
              <IonLabel position="stacked">OTP</IonLabel>
              <IonInput type="text" value={otp} onIonInput={(e) => setOtp(e.detail.value!)} placeholder="Enter OTP" />
            </IonItem>
            <IonButton expand="full" onClick={verifyOTP}>Verify OTP</IonButton>
          </IonContent>
        </IonModal>

        <IonToast isOpen={showToast} message={toastMessage} color="danger" duration={2000} position="top" onDidDismiss={() => setShowToast(false)} />
        <IonLoading isOpen={loading} message="Logging in..." duration={1500} />
      </IonContent>

      <style>
        {`
          .login-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
          }

          .login-container {
            width: 100%;
            max-width: 400px;
            padding: 20px;
            text-align: center;
          }

          .input-field {
            margin-bottom: 15px;
            border-radius: 10px;
          }

          .input-field ion-input {
            --padding-start: 12px; 
          }

          .eye-button {
            height: 100%;
          }

          .register-btn {
            border-radius: 10px;
            background: #4CAF50;
            color: white;
          }

          .register-link {
            text-align: center;
            margin-top: 10px;
          }
        `}
      </style>
    </IonPage>
  );
};

export default Login;