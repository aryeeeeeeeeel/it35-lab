import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonMenu,
    IonMenuButton,
    IonMenuToggle,
    IonPage,
    IonRouterOutlet,
    IonSplitPane,
    IonTitle,
    IonToolbar
} from '@ionic/react'
import { homeOutline, logOutOutline, rocketOutline } from 'ionicons/icons';
import { supabase } from '../utils/supabaseClient';
import { useIonRouter } from '@ionic/react';
import { Redirect, Route } from 'react-router';
import Home from './Home';
import About from './About';
import Details from './Details';

const Menu: React.FC = () => {
    const path = [
        { name: 'Home', url: '/it35b-lab/app/home', icon: homeOutline },
        { name: 'About', url: '/it35b-lab/app/about', icon: rocketOutline },
    ]

    const navigation = useIonRouter();

    const doLogout = async () => {
        await supabase.auth.signOut();
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('password');
        navigation.push('/it35b-lab');
    };
    

    return (
        <IonPage>
            <IonSplitPane contentId="main">
                <IonMenu contentId="main">
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>
                                Menu
                            </IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        {path.map((item, index) => (
                            <IonMenuToggle key={index}>
                                <IonItem routerLink={item.url} routerDirection="forward">
                                    <IonIcon icon={item.icon} slot="start"></IonIcon>
                                    {item.name}
                                </IonItem>
                            </IonMenuToggle>
                        ))}

                        <IonButton expand="full" onClick={doLogout}>
                            <IonIcon icon={logOutOutline} slot="start" />
                            Logout
                        </IonButton>


                    </IonContent>
                </IonMenu>

                <IonRouterOutlet id="main">
                    <Route exact path="/it35b-lab/app/home" component={Home} />
                    <Route exact path="/it35b-lab/app/home/details" component={Details} />
                    <Route exact path="/it35b-lab/app/about" component={About} />
                    <Route exact path="/it35b-lab/app">
                        <Redirect to="/it35b-lab/app/home" />
                    </Route>
                </IonRouterOutlet>
            </IonSplitPane>
        </IonPage>
    );
};

export default Menu;