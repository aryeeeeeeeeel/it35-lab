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
  useIonRouter,
  IonIcon,
  IonToast,
  IonLoading,
} from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import { useState } from 'react';

const Register: React.FC = () => {
  const navigation = useIonRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const doRegister = () => {
    if (username.trim() === '') {
      setErrorMessage('Username cannot be empty.');
      return;
    }
    const existingUsernames = ['admin'];
    if (existingUsernames.includes(username)) {
      setErrorMessage('Username is already taken. Choose another one.');
      return;
    }
    if (!email.endsWith('@nbsc.edu.ph')) {
      setErrorMessage('Use an @nbsc.edu.ph email.');
      return;
    }

    const validatePassword = (password: string) => {
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_,.?":{}|<>]/.test(password);

      if (password.trim() === '') {
        return 'Password cannot be empty.';
      }
      if (password.length < minLength) {
        return 'Password must be at least 8 characters long.';
      }
      if (!hasUpperCase) {
        return 'Password must contain at least one uppercase letter.';
      }
      if (!hasLowerCase) {
        return 'Password must contain at least one lowercase letter.';
      }
      if (!hasNumber) {
        return 'Password must contain at least one number.';
      }
      if (!hasSpecialChar) {
        return 'Password must contain at least one special character.';
      }
      return '';
    };
    if (password.trim() === '') {
      setErrorMessage('Password is required.');
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Registration successful!');
      setTimeout(() => {
        setSuccessMessage('');
        navigation.push('/it35b-lab/', 'root', 'replace');
      }, 1500);

    }, 1500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="dark-toolbar">
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding dark-theme" fullscreen>
        <div className="register-wrapper">
          <div className="register-container">
            <h2>Create an Account</h2>
            <p>Fill in the details below</p>

            <IonItem className="input-field">
              <IonLabel position="stacked">Username</IonLabel>
              <IonInput value={username} onIonInput={(e) => setUsername(e.detail.value!)} placeholder="Enter your username" />
            </IonItem>

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

            <IonItem className="input-field">
              <IonLabel position="stacked">Confirm Password</IonLabel>
              <IonInput
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                placeholder="Confirm your password"
              />
              <IonButton fill="clear" slot="end" className="eye-button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <IonIcon icon={showConfirmPassword ? eyeOff : eye} />
              </IonButton>
            </IonItem>

            <IonButton expand="full" className="register-btn" onClick={doRegister}>
              REGISTER
            </IonButton>

            <p className="login-link">
              Already have an account? <br />
              <IonButton fill="clear" className="login-btn" onClick={() => navigation.push('/it35b-lab/')}>
                LOGIN
              </IonButton>
            </p>
          </div>
        </div>

        <IonToast isOpen={!!errorMessage} message={errorMessage} color="danger" duration={2000} position="top" onDidDismiss={() => setErrorMessage('')} />
        <IonToast isOpen={!!successMessage} message={successMessage} color="success" duration={2000} position="top" onDidDismiss={() => setSuccessMessage('')} />
        <IonLoading isOpen={loading} message="Registering..." />
      </IonContent>

      <style>
        {`
          .register-wrapper {
            display: flex;
            justify-content: center;
            height: 100%;
          }

          .register-container {
            width: 100%;
            max-width: 400px;
            padding: 20px;
            text-align: center;
          }

          .input-field {
            margin-bottom: 15px;
            border-radius: 10px;
          }

          .login-btn {
            border-radius: 10px;
            background: #4CAF50;
            color: white;
          }

          .eye-button {
            height: 100%;
          }
        `}
      </style>
    </IonPage>
  );
};

export default Register;