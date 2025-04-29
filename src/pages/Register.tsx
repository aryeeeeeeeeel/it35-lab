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
import { supabase } from '../utils/supabaseClient';
import bcrypt from 'bcryptjs';

const Register: React.FC = () => {
  const navigation = useIonRouter();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must include an uppercase letter.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must include a lowercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must include a number.';
    }
    if (!/[!@#$%^&*_]/.test(password)) {
      return 'Password must include a special character (!@#$%^&*_).';
    }
    return null;
  };

  const doRegister = async () => {
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

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const { data: signUpData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        setErrorMessage(authError.message);
        return;
      }

      const user = signUpData?.user;

      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            username,
            user_email: email,
            user_firstname: firstName,
            user_lastname: lastName,
            user_avatar_url: avatarUrl,
            user_password: hashedPassword,
          },
        ]);

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage('Registration successful! Please verify your email.');
      setTimeout(() => {
        setSuccessMessage('');
        navigation.push('/it35-lab/', 'root', 'replace');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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

            <IonInput
              label="Username"
              labelPlacement="floating"
              fill="outline"
              value={username}
              onIonInput={(e) => setUsername(e.detail.value!)}
              className="input-field"
            />
            <IonInput
              label="First Name"
              labelPlacement="floating"
              fill="outline"
              value={firstName}
              onIonInput={(e) => setFirstName(e.detail.value!)}
              className="input-field"
            />

            <IonInput
              label="Last Name"
              labelPlacement="floating"
              fill="outline"
              value={lastName}
              onIonInput={(e) => setLastName(e.detail.value!)}
              className="input-field"
            />

            <IonInput
              label="Avatar URL"
              labelPlacement="floating"
              fill="outline"
              value={avatarUrl}
              onIonInput={(e) => setAvatarUrl(e.detail.value!)}
              className="input-field"
            />

            <IonInput
              label="Email"
              labelPlacement="floating"
              fill="outline"
              type="email"
              value={email}
              onIonInput={(e) => setEmail(e.detail.value!)}
              className="input-field"
            />

            <div className="input-field password-field">
              <IonInput
                label="Password"
                labelPlacement="floating"
                fill="outline"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
              />
              <IonIcon
                icon={showPassword ? eyeOff : eye}
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="input-field password-field">
              <IonInput
                label="Confirm Password"
                labelPlacement="floating"
                fill="outline"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onIonInput={(e) => setConfirmPassword(e.detail.value!)}
              />
              <IonIcon
                icon={showConfirmPassword ? eyeOff : eye}
                className="eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>

            <IonButton expand="full" className="register-btn" onClick={doRegister}>
              REGISTER
            </IonButton>

            <p className="login-link">
              Already have an account? <br />
              <IonButton fill="clear" className="login-btn" onClick={() => navigation.push('/it35-lab/')}>
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

          .password-field {
            position: relative;
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
        `}
      </style>
    </IonPage>
  );
};

export default Register;