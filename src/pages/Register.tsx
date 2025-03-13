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
  IonIcon
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

  const existingUsernames = ['admin'];

  const validateEmail = (email: string) => {
    return /^[\w.-]+@gmail\.com$/.test(email);
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const doRegister = () => {
    if (username.trim() === '') {
      alert('Username cannot be empty. Please enter a username.');
      return;
    }
    if (existingUsernames.includes(username)) {
      alert('Username is already taken. Choose another one.');
      return;
    }
    if (!validateEmail(email)) {
      alert('Invalid email address. Please enter a valid Gmail address ending in @gmail.com.');
      return;
    }
    if (!validatePassword(password)) {
      alert('Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Registration successful! Please login with your new account.');
    navigation.push('/it35b-lab/', 'forward', 'replace');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <div className="register-container">
          <h2>Create an Account</h2>
          <p>Fill in the details below</p>

          <IonItem className="input-field">
            <IonLabel position="stacked">Username</IonLabel>
            <IonInput
              type="text"
              placeholder="Enter your username"
              value={username}
              onIonInput={(e) => setUsername(e.detail.value!)}
            />
          </IonItem>

          <IonItem className="input-field">
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              type="email"
              placeholder="Enter your email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value!)}
            />
          </IonItem>

          <IonItem className="input-field">
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onIonInput={(e) => setPassword(e.detail.value!)}
            />
            <IonButton
              fill="clear"
              slot="end"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              <IonIcon icon={showPassword ? eyeOff : eye} />
            </IonButton>
          </IonItem>

          <IonItem className="input-field">
            <IonLabel position="stacked">Confirm Password</IonLabel>
            <IonInput
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={confirmPassword}
              onIonInput={(e) => setConfirmPassword(e.detail.value!)}
            />
            <IonButton
              fill="clear"
              slot="end"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle"
            >
              <IonIcon icon={showConfirmPassword ? eyeOff : eye} />
            </IonButton>
          </IonItem>

          <IonButton expand="full" className="register-btn" onClick={doRegister}>
            Register
          </IonButton>

          <p className="login-link">
            Already have an account?  
            <IonButton fill="clear" onClick={() => navigation.push('/it35b-lab/')}>
              Login
            </IonButton>
          </p>
        </div>
      </IonContent>

      <style>
        {`
          .register-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 20px;
          }

          .register-container h2 {
            font-size: 24px;
            margin-bottom: 10px;
          }

          .register-container p {
            color: gray;
            margin-bottom: 20px;
          }

          .input-field {
            width: 100%;
            max-width: 400px;
            margin-bottom: 15px;
            border-radius: 10px;
          }

          .password-toggle {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
          }

          .register-btn {
            width: 100%;
            max-width: 400px;
            border-radius: 10px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          }

          .login-link {
            margin-top: 10px;
            font-size: 14px;
          }

          .login-link a {
            color: #3880ff;
            text-decoration: none;
            font-weight: bold;
          }
        `}
      </style>
    </IonPage>
  );
};

export default Register;