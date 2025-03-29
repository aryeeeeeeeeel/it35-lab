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

  // 🔹 Fetch user ID from email
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
    const lockTime = new Date();
    lockTime.setMinutes(lockTime.getMinutes() + lockDuration);

    await supabase
      .from('failed_logins')
      .update({ locked_until: lockTime.toISOString() })
      .eq('user_id', userId);
  };

  // 🔹 Check if account is locked
  const isAccountLocked = async (userId: string) => {
    const failedData = await getFailedLoginData(userId);

    if (!failedData || !failedData.locked_until) return false;

    const now = new Date();
    const lockedUntil = new Date(failedData.locked_until);

    console.log("Current Time:", now);
    console.log("Locked Until:", lockedUntil);

    return now.getTime() < lockedUntil.getTime()
      ? `Your account is locked until ${lockedUntil.toLocaleTimeString()}.`
      : false;
  };

  const trackFailedLogin = async (userId: string) => {
    const failedData = await getFailedLoginData(userId);
    let attempts = failedData?.failed_attempts || 0;
    let lockDuration = 0;

    attempts += 1;

    if (attempts === 3) lockDuration = 5; // Lock for 5 minutes after 3 failed attempts
    if (attempts === 6) lockDuration = 10; // Lock for 10 minutes after 6 failed attempts

    await supabase
      .from('failed_logins')
      .upsert([{ user_id: userId, failed_attempts: attempts, last_attempt: new Date().toISOString() }]);

    if (lockDuration > 0) {
      await lockAccount(userId, lockDuration);
    }
  };

  const resetFailedAttempts = async (userId: string) => {
    await supabase
      .from('failed_logins')
      .update({ failed_attempts: 0, locked_until: null })
      .eq('user_id', userId);
  };

  // 🔹 Login function
  const doLogin = async () => {
    setShowToast(false);
    setLoading(true);

    if (email.trim() === '' || password.trim() === '') {
      setToastMessage('Please enter your email and password.');
      setShowToast(true);
      setLoading(false);
      return;
    }

    // 🔹 Check if email ends with @nbsc.edu.ph
    if (!email.endsWith('@nbsc.edu.ph')) {
      setLoading(true); // Show loading first

      setTimeout(() => {
        setLoading(false); // Stop loading
        setToastMessage('Invalid email or password. Please try again.');
        setShowToast(true);
      }, 1000); // Delay to ensure loading completes before showing toast

      return;
    }


    try {
      // Get user ID
      const userId = await getUserByEmail(email);
      if (!userId) {
        setToastMessage('User not found. Please register.');
        setShowToast(true);
        setLoading(false);
        return;
      }

      // Check if account is locked
      const lockMessage = await isAccountLocked(userId);
      if (lockMessage) {
        setToastMessage(lockMessage);
        setShowToast(true);
        setLoading(false);
        return;
      }

      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error || !data.user) {
        await trackFailedLogin(userId); // Track failed attempt
        setToastMessage('Invalid email or password. Please try again.');
        setShowToast(true);
        setLoading(false);
        return;
      }

      // Reset failed login attempts on success
      await resetFailedAttempts(userId);

      console.log('Login successful:', data);
      setLoading(false);
      navigation.push('/it35b-lab/app', 'forward', 'replace');
    } catch (err) {
      setToastMessage((err as Error).message);
      setShowToast(true);
      setLoading(false);
      console.error('Login error:', err);
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