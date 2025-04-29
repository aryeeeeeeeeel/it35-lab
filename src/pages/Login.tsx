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
import bcrypt from 'bcryptjs';

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      setShowToast(true);
      return;
    }

    setLoading(true);
    setShowToast(false);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_email', email.trim())
        .single();

      if (error || !data) {
        setShowToast(true);
        return;
      }

      const isValidPassword = await bcrypt.compare(password.trim(), data.user_password);
      if (!isValidPassword) {
        setShowToast(true);
        return;
      }

      // Save session
      sessionStorage.setItem('user_id', data.user_id);
      sessionStorage.setItem('username', data.username);

      // Navigate
      navigation.push('/it35-lab/app', 'forward', 'replace');
    } catch (err) {
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

            {/* Email Input */}
            <IonInput
              label="Email"
              labelPlacement="floating"
              fill="outline"
              type="email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value!)}
              className="input-field"
            />

            {/* Password Input with Eye Icon */}
            <div className="input-field password-field">
              <IonInput
                label="Password"
                labelPlacement="floating"
                fill="outline"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
                className="password-input"
              />
              <IonIcon
                icon={showPassword ? eyeOff : eye}
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <IonButton expand="full" className="login-btn" onClick={doLogin}>
              LOGIN
            </IonButton>

            <p className="register-link">
              Don&apos;t have an account? <br />
              <IonButton
                fill="clear"
                className="register-btn"
                onClick={() => navigation.push('/it35-lab/register')}
              >
                Sign up
              </IonButton>
            </p>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          message="Invalid username or password!"
          color="danger"
          duration={2000}
          position="top"
          onDidDismiss={() => setShowToast(false)}
        />
        <IonLoading isOpen={loading} message="Logging in..." />
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
          }

          .password-field {
            position: relative;
          }

          .password-input {
            --padding-start: 12px;
          }

          .eye-icon {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            font-size: 24px;
            color: skyblue;
            cursor: pointer;
            padding: 6px;
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

          .login-btn {
            margin-top: 15px;
          }
        `}
      </style>
    </IonPage>
  );
};

export default Login;