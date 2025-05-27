import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router';


const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const LandingPageContainer = styled.div`
  background: linear-gradient(315deg, #0cbaba 0%, #380036 74%);
  animation: ${gradientAnimation} 15s ease infinite;
  background-size: 400% 400%;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ///////
  padding: 280px;
  text-align: center;
`;

const HeroSection = styled.div`
  margin-bottom: 60px;
`;

const MainTitle = styled.h1`
  font-size: 4em;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const SubTitle = styled.p`
  font-size: 1.5em;
  margin-bottom: 30px;
  opacity: 0.8;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
`;

const MainButton = styled(Link)`
  background-color: #007bff;
  color: white;
  padding: 15px 30px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 1.2em;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const SecondaryButton = styled(Link)`
  color: white;
  border: 2px solid white;
  padding: 13px 28px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 1.2em;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const FeaturesSection = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  padding: 50px;
  border-radius: 15px;
  margin-bottom: 60px;
`;

const FeaturesTitle = styled.h2`
  font-size: 2.5em;
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const FeatureItem = styled.div`
  padding: 20px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  text-align: left;
`;

const FeatureHeading = styled.h3`
  font-size: 1.8em;
  margin-bottom: 10px;
`;

const FeatureDescription = styled.p`
  font-size: 1.1em;
  opacity: 0.9;
`;

const CallToActionSection = styled.div`
  margin-top: 80px;
`;

const CTAHeading = styled.h2`
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const CTASubTitle = styled.p`
  font-size: 1.3em;
  margin-bottom: 40px;
  opacity: 0.8;
`;

const LandingPage: React.FC = () => {
  return (
    <LandingPageContainer>
      <HeroSection>
        <MainTitle>הכירו את המטבח החכם שלכם</MainTitle>
        <SubTitle>ניהול מלא של מוצרי המטבח, רשימות קניות חכמות ועזרה בהכנת מתכונים - הכל במקום אחד.</SubTitle>
        <ActionButtons>
          <MainButton to="/signup">התחברו עכשיו</MainButton>
          <SecondaryButton to="/login">כבר יש לכם חשבון?</SecondaryButton>
        </ActionButtons>
      </HeroSection>

      <FeaturesSection>
        <FeaturesTitle>מה המטבח החכם שלנו יכול לעשות עבורכם?</FeaturesTitle>
        <FeatureGrid>
          <FeatureItem>
            <FeatureHeading>ניהול מוצרים חכם</FeatureHeading>
            <FeatureDescription>עקבו בקלות אחרי כל המוצרים במטבח שלכם, תאריכי תפוגה וכמויות.</FeatureDescription>
          </FeatureItem>
          <FeatureItem>
            <FeatureHeading>רשימות קניות אוטומטיות</FeatureHeading>
            <FeatureDescription>המערכת תיצור עבורכם רשימת קניות חכמה בהתבסס על המוצרים החסרים והמתכונים שתכננתם.</FeatureDescription>
          </FeatureItem>
          <FeatureItem>
            <FeatureHeading>עוזר מתכונים אישי</FeatureHeading>
            <FeatureDescription>בחרו מתכון, ובדקו מיד אם יש לכם את כל המצרכים הדרושים. קבלו הצעות למתכונים בהתאם למה שיש במטבח.</FeatureDescription>
          </FeatureItem>
        </FeatureGrid>
      </FeaturesSection>

      <CallToActionSection>
        <CTAHeading>מוכנים לשדרג את המטבח שלכם?</CTAHeading>
        <CTASubTitle>הצטרפו עוד היום ותהנו מחוויית מטבח חכמה ונוחה מאי פעם!</CTASubTitle>
        <MainButton to="/signup" style={{ fontSize: '1.5em', padding: '20px 40px' }}>
          התחילו עכשיו
        </MainButton>
      </CallToActionSection>
    </LandingPageContainer>
  );
};

export default LandingPage