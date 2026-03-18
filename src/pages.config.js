/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AITutor from './pages/AITutor';
import About from './pages/About';
import ComingSoon from './pages/ComingSoon';
import DesignGenerator from './pages/DesignGenerator';
import FabricSelect from './pages/FabricSelect';
import FabricVisualizer from './pages/FabricVisualizer';
import FreeDesignIllustrator from './pages/FreeDesignIllustrator';
import FreeHome from './pages/FreeHome';
import GarmentViewer from './pages/GarmentViewer';
import Home from './pages/Home';
import ImageAnalysis from './pages/ImageAnalysis';
import Landing from './pages/Landing';
import LessonDetail from './pages/LessonDetail';
import Lessons from './pages/Lessons';
import ModeSelect from './pages/ModeSelect';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Policy from './pages/Policy';
import PremiumHome from './pages/PremiumHome';
import ProblemSolver from './pages/ProblemSolver';
import Progress from './pages/Progress';
import Results from './pages/Results';
import SewingSimulator from './pages/SewingSimulator';
import StitchSelect from './pages/StitchSelect';
import TermsOfService from './pages/TermsOfService';
import UserProfile from './pages/UserProfile';
import WorkspaceDetail from './pages/WorkspaceDetail';
import WorkspaceList from './pages/WorkspaceList';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AITutor": AITutor,
    "About": About,
    "ComingSoon": ComingSoon,
    "DesignGenerator": DesignGenerator,
    "FabricSelect": FabricSelect,
    "FabricVisualizer": FabricVisualizer,
    "FreeDesignIllustrator": FreeDesignIllustrator,
    "FreeHome": FreeHome,
    "GarmentViewer": GarmentViewer,
    "Home": Home,
    "ImageAnalysis": ImageAnalysis,
    "Landing": Landing,
    "LessonDetail": LessonDetail,
    "Lessons": Lessons,
    "ModeSelect": ModeSelect,
    "Payment": Payment,
    "PaymentSuccess": PaymentSuccess,
    "Policy": Policy,
    "PremiumHome": PremiumHome,
    "ProblemSolver": ProblemSolver,
    "Progress": Progress,
    "Results": Results,
    "SewingSimulator": SewingSimulator,
    "StitchSelect": StitchSelect,
    "TermsOfService": TermsOfService,
    "UserProfile": UserProfile,
    "WorkspaceDetail": WorkspaceDetail,
    "WorkspaceList": WorkspaceList,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};