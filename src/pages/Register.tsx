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
  IonModal,
} from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import { IonAlert } from '@ionic/react';
import { useIonViewWillEnter } from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import bcrypt from 'bcryptjs';

const Register: React.FC = () => {
  const navigation = useIonRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useIonViewWillEnter(() => {
    setName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    setSuccessMessage('');
  });

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_,.?":{}|<>]/.test(password);

    if (password.trim() === '') return 'Password cannot be empty.';
    if (password.length < minLength) return 'Password must be at least 8 characters.';
    if (!hasUpperCase) return 'Include at least one uppercase letter.';
    if (!hasLowerCase) return 'Include at least one lowercase letter.';
    if (!hasNumber) return 'Include at least one number.';
    if (!hasSpecialChar) return 'Include at least one special character.';
    return '';
  };

  const confirmRegister = () => {
    setShowConfirm(true);
  };

  const doRegister = async () => {
    setShowConfirm(false);

    console.log('Registering...');

    setErrorMessage('');
    setSuccessMessage('');

    if (name.trim() === '') {
      setErrorMessage('Name cannot be empty.');
      return;
    }

    if (username.trim() === '') {
      setErrorMessage('Username cannot be empty.');
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

    if (!email || !password) {
      setErrorMessage('Fields cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const hashedPassword = await bcrypt.hash(password, 10);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      });

      console.log('Supabase response:', data, error);

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setErrorMessage('Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('users')
        .insert([
          { id: data.user.id, name, username, email, password_hash: hashedPassword }
        ]);

      if (insertError) {
        setErrorMessage(insertError.message);
        setLoading(false);
        return;
      }

      setSuccessMessage('Check your email to verify!');
      setTimeout(() => navigation.push('/ias/'), 2000);
    } catch (err) {
      console.error('Unexpected Error:', err);
      setErrorMessage('Something went wrong.');
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

            <IonItem className="input-field">
              <IonLabel position="stacked">Full Name</IonLabel>
              <IonInput type="text" value={name} onIonInput={(e) => setName(e.detail.value!)} placeholder="Enter your full name" />
            </IonItem>


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

            <IonButton expand="full" className="register-btn" onClick={confirmRegister}>
              REGISTER
            </IonButton>


            <p className="login-link">
              Already have an account? <br />
              <IonButton fill="clear" className="login-btn" onClick={() => navigation.push('/ias/')}>
                LOGIN
              </IonButton>
            </p>
          </div>
        </div>

        <IonModal
          isOpen={showConfirm}
          onDidDismiss={() => setShowConfirm(false)}
          className="custom-modal"
        >
          <div className="modal-content">
            <h2>Confirm Registration</h2>
            <p>Are you sure you want to register with:</p>
            <p className="email-highlight">{email}</p>

            <div className="modal-buttons">
              <IonButton fill="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </IonButton>
              <IonButton color="success" onClick={doRegister}>
                Yes, Register
              </IonButton>
            </div>
          </div>
        </IonModal>


        <IonToast isOpen={!!errorMessage} message={errorMessage} color="danger" duration={2000} position="top" onDidDismiss={() => setErrorMessage('')} />
        <IonToast isOpen={!!successMessage} message={successMessage} color="success" duration={2000} position="top" onDidDismiss={() => setSuccessMessage('')} />
        <IonLoading isOpen={loading} message="Registering..." />
      </IonContent>

      <style>
        {`
          .register-wrapper {
            display: flex;
            justify-content: center;
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

          .modal-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }

          .modal-content {
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            text-align: center;
          }

          .email-highlight {
            font-weight: bold;
            color:rgb(255, 255, 255);
            margin-bottom: 20px;
          }

          .modal-buttons {
            display: flex;
            justify-content: space-between;
            width: 100%;
          }

          .custom-modal {
            display: flex;
            justify-content: center;
            align-items: center;
            --width: auto;
            --height: auto;
            --max-width: 350px;
            --max-height: 400px;
          }
        `}
      </style>
    </IonPage>
  );
};

export default Register;