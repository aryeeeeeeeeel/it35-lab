import kagawskie from "../img/kagawskie.jpg";
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';

const About: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-text-center">
        <IonCard style={{
          maxWidth: "350px",
          margin: "auto",
          textAlign: "center",
          paddingTop: "50px",
          backgroundColor: "transparent",
        }}>
          <img
            src={kagawskie}
            alt="Kagawskie"
            style={{
              display: "block",
            }}
          />
          <IonCardHeader style={{ backgroundColor: "#1E1E1E" }}>
            <IonCardTitle style={{ color: "white" }}>Ariel S. Sumantin</IonCardTitle>
            <IonCardSubtitle style={{ color: "white" }}>AKAP Member</IonCardSubtitle>
            <IonCardSubtitle style={{ color: "white" }}>Ayaw Kalimti Ang Pag...?</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent style={{ backgroundColor: "#1E1E1E", color: "white" }}>
            "It is what it is, AKAP it is!"
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default About;