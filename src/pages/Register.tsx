import { 
    IonButton,
    IonButtons,
      IonContent, 
      IonHeader, 
      IonInput, 
      IonInputPasswordToggle, 
      IonItem, 
      IonList, 
      IonMenuButton, 
      IonPage, 
      IonTitle, 
      IonToolbar 
  } from '@ionic/react';
  
  const Register: React.FC = () => {
    
    return (
        <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Register</IonTitle>
          </IonToolbar>
        </IonHeader>
      <IonList>
      <IonItem>
        <IonInput type="email" label="Email:"  value=""></IonInput>
      </IonItem>
    <IonInput type="password" label="Password:" value="">
      <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
    </IonInput>
    <IonInput type="password" label="Confirm Password:" value="">
      <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
    </IonInput>
    </IonList>
        <IonContent className='ion-padding'>
            <IonButton fill="solid">
                Register
            </IonButton>
            <IonButton fill="outline">
                Login
            </IonButton>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Register;