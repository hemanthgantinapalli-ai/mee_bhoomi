import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Breadcrumbs from './components/Breadcrumbs';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

import HomePage from './pages/HomePage';
import AdangalPage from './pages/AdangalPage';
import ROR1BPage from './pages/ROR1BPage';
import LPMapPage from './pages/LPMapPage';
import AadhaarStatusPage from './pages/AadhaarStatusPage';
import EPassbookPage from './pages/EPassbookPage';
import MutationStatusPage from './pages/MutationStatusPage';
import WaterTaxPage from './pages/WaterTaxPage';

export default function App() {
  // Support hash routing for direct page access and browser refresh
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('meebhoomi_citizen');
    } catch {}
    handleTabChange('home');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setActiveTab(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const getBreadcrumbItems = () => {
    switch (activeTab) {
      case 'adangal': return ['మీ అడంగల్ (Your Adangal)'];
      case 'village-adangal': return ['గ్రామ అడంగల్ (Village Adangal)'];
      case '1b': return ['మీ 1-బి (Your 1-B / ROR)'];
      case 'village-1b': return ['గ్రామ 1-బి (Village 1-B)'];
      case 'lp-map': return ['ఎల్.పీ. మ్యాప్ / FMB (Land Parcel Map)'];
      case 'aadhaar-status': return ['ఆధార్ సీడింగ్ స్థితి (Aadhaar Link Status)'];
      case 'passbook': return ['ఎలక్ట్రానిక్ పాస్‌బుక్ (E-Passbook Download)'];
      case 'mutation-status': return ['మ్యుటేషన్ దరఖాస్తు స్థితి (Mutation Status)'];
      case 'water-tax': return ['నీటి పన్ను చెల్లింపు (Water Tax Payment)'];
      default: return [];
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Government Branding Header */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Breadcrumb Trail (only if needed, official MeeBhoomi pages do not show breadcrumbs) */}
      {false && activeTab !== 'home' && (
        <Breadcrumbs
          items={getBreadcrumbItems()}
          onHomeClick={() => handleTabChange('home')}
        />
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <HomePage
            onSelectService={handleTabChange}
            currentUser={currentUser}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
          />
        )}
        {activeTab === 'adangal' && <AdangalPage isVillageAdangal={false} />}
        {activeTab === 'village-adangal' && <AdangalPage isVillageAdangal={true} />}
        {activeTab === '1b' && <ROR1BPage isVillage1B={false} />}
        {activeTab === 'village-1b' && <ROR1BPage isVillage1B={true} />}
        {activeTab === 'lp-map' && <LPMapPage />}
        {activeTab === 'aadhaar-status' && <AadhaarStatusPage />}
        {activeTab === 'passbook' && <EPassbookPage />}
        {activeTab === 'mutation-status' && <MutationStatusPage />}
        {activeTab === 'water-tax' && <WaterTaxPage />}
      </main>

      {/* MeeBhoomi Digital Assistant Chatbot */}
      <Chatbot onSelectTab={handleTabChange} />

      {/* Official Footer with ACB 14400 Helpline, CCLA Address & NIC credit */}
      <Footer />
    </div>
  );
}
