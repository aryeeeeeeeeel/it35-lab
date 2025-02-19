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
          overflow: "hidden",
          width: "100%",
          maxWidth: "350px",
          margin: "auto",
          textAlign: "center",
          paddingTop: "50px",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}>
          <img
            alt="kagawskie"
            src="https://scontent.fcgy2-1.fna.fbcdn.net/v/t39.30808-6/468154309_2279300132447339_289256505525545550_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGeRod1asI7_VkscDHxOKVtJtU0DJZMBEgm1TQMlkwESCpJIyUgmUJ7hHZHDPzddPtUCddH74FAIYfwL4HaCeaj&_nc_ohc=8188zn5-G1sQ7kNvgFVNz-q&_nc_oc=AdhZbIo4n4tE6hSQHsxRoF1CyGFLTw6x960juF53jFT0B7IrZV_sm3viEMrUVjCDyno&_nc_zt=23&_nc_ht=scontent.fcgy2-1.fna&_nc_gid=AansD6gUkbESGc9d001RRFt&oh=00_AYDCCEIZtpUBMDyJ8DtpnjYfqnapkDPIeUFIBUKzH3Fkzw&oe=67BBB05E"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
            }}
          />
          <IonCardHeader style={{ backgroundColor: "#1E1E1E" }}>
            <IonCardTitle style={{ color: "white" }}>Ariel S. Sumantin</IonCardTitle>
            <IonCardSubtitle style={{ color: "white" }}>AKAP Member</IonCardSubtitle>
            <IonCardSubtitle style={{ color: "white" }}>Ayaw Kalimti Ang Pagpa...salamat</IonCardSubtitle>
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