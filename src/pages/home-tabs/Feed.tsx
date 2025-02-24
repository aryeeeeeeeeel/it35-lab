import { 
  IonButton,
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
  const Feed: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot='start'>
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Classroom</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonCard color="light">
            <IonCardHeader>
              <IonCardTitle>IT35B Application Development & Emerging Technologies</IonCardTitle>
              <IonCardSubtitle>IT71 2nd Semester A.Y. 2024-2025</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>NBSC Computer Studies</IonCardContent>
            <IonButton fill="clear">Open</IonButton>
          </IonCard>
          <IonCard color="light">
            <IonCardHeader>
              <IonCardTitle>IT36B Information Assurance & Security 2</IonCardTitle>
              <IonCardSubtitle>IT72 2nd Semester A.Y. 2024-2025</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>NBSC Computer Studies</IonCardContent>
            <IonButton fill="clear">Open</IonButton>
          </IonCard>
          <IonCard color="light">
            <IonCardHeader>
              <IonCardTitle>IT37B Elective 4 (Hardware Implemention Technologies)</IonCardTitle>
              <IonCardSubtitle>IT73 2nd Semester A.Y. 2024-2025</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>NBSC Computer Studies</IonCardContent>
            <IonButton fill="clear">Open</IonButton>
          </IonCard>
          <IonCard color="light">
            <IonCardHeader>
              <IonCardTitle>IT38B Enterprise System</IonCardTitle>
              <IonCardSubtitle>IT74 2nd Semester A.Y. 2024-2025</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>NBSC Computer Studies</IonCardContent>
            <IonButton fill="clear">Open</IonButton>
          </IonCard>
          <IonCard color="light">
            <IonCardHeader>
              <IonCardTitle>IT39B System Integration & Architecture 2</IonCardTitle>
              <IonCardSubtitle>IT75 2nd Semester A.Y. 2024-2025</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>NBSC Computer Studies</IonCardContent>
            <IonButton fill="clear">Open</IonButton>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  };
  export default Feed;