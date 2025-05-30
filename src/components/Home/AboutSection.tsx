import React from 'react'
import { MusicIcon, AwardIcon, UsersIcon } from 'lucide-react'
import {
  AboutSectionWrapper,
  AboutContainer,
  AboutHeader,
  SectionHeading,
  SectionDivider,
  AboutContent,
  AboutImageWrapper,
  AboutImage,
  AboutText,
  CoachName,
  CoachDescription,
  FeatureGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureText,
  TeachingPhilosophy,
} from '../../styles/Home/About.styles'

export const AboutSection = () => {
  return (
    <AboutSectionWrapper id="about">
      <AboutContainer>
        <AboutHeader>
          <SectionHeading>About the Coach</SectionHeading>
          <SectionDivider />
        </AboutHeader>
        <AboutContent>
          <AboutImageWrapper>
            <AboutImage
              src="https://images.icon-icons.com/517/PNG/512/1452632149_inspiration-39_icon-icons.com_51111.png"
              alt="Vocal Coach"
            />
          </AboutImageWrapper>
          <AboutText>
            <CoachName>JP</CoachName>
            <CoachDescription>
              With over 15 years of experience in vocal training and performance, I'm
              dedicated to helping singers of all levels discover their unique voice
              and reach their full potential.
            </CoachDescription>
            <FeatureGrid>
              <Feature
                icon={<MusicIcon />}
                title="Customized Training"
                text="Personalized lessons for your unique voice"
              />
              <Feature
                icon={<AwardIcon />}
                title="Professional Experience"
                text="15+ years of teaching and performance"
              />
              <Feature
                icon={<UsersIcon />}
                title="All Skill Levels"
                text="From beginners to professional singers"
              />
            </FeatureGrid>
            <TeachingPhilosophy>
              My teaching philosophy centers on building a strong technical foundation
              while encouraging creative expression.
            </TeachingPhilosophy>
          </AboutText>
        </AboutContent>
      </AboutContainer>
    </AboutSectionWrapper>
  )
}

const Feature = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) => (
  <FeatureCard>
    <FeatureIcon>{icon}</FeatureIcon>
    <FeatureTitle>{title}</FeatureTitle>
    <FeatureText>{text}</FeatureText>
  </FeatureCard>
)
