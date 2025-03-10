import kagawskie from "../img/kagawskie.jpg";
import { 
      IonAvatar,
      IonButton,
      IonButtons,
      IonCard,
      IonContent, 
      IonHeader, 
      IonInput, 
      IonInputPasswordToggle, 
      IonItem, 
      IonList, 
      IonMenuButton, 
      IonPage, 
      IonText, 
      IonTitle, 
      IonToolbar, 
      useIonRouter
  } from '@ionic/react';
  
  const Login: React.FC = () => {
    const navigation = useIonRouter();
    const doLogin = () => {
        navigation.push('/it35b-lab/app','forward','replace');
    }
    const doRegister = () => {
      navigation.push('/it35b-lab/register','forward','replace');
  }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonAvatar style={{
          margin: "auto",
        }}><img
            src={kagawskie}
            alt="Kagawskie"
          />
      </IonAvatar>
      <IonList>
      <IonItem>
        <IonInput type="email" label="Email:"  value=""></IonInput>
      </IonItem>
    <IonInput type="password" label="Password:" value="">
      <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
    </IonInput>
    </IonList>
        <IonContent className='ion-padding'>
            <IonButton onClick={() => doLogin()} fill="solid">
                Login
            </IonButton>
            <IonButton onClick={() => doRegister()} fill="outline">
              Register
              </IonButton>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Login;