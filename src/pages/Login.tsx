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

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const doLogin = () => {
    if (email.trim() === '' || password.trim() === '') {
      setShowToast(true);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.push('/it35-lab/app', 'forward', 'replace');
    }, 1500);
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
              <IonInput type="text" value={email} onIonInput={(e) => setEmail(e.detail.value!)} placeholder="Enter your email" />
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

            <IonButton expand="full" className="login-btn" onClick={doLogin}>
              LOGIN
            </IonButton>

            <p className="register-link">
              Don't have an account?  <br />
              <IonButton fill="clear" className="register-btn" onClick={() => navigation.push('/it35-lab/register')}>
                Sign up
              </IonButton>
            </p>
          </div>
        </div>

        <IonToast isOpen={showToast} message="Invalid username or password!" color="danger" duration={2000} position="top" onDidDismiss={() => setShowToast(false)} />
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