import React from 'react'
import {
  MicIcon,
  TargetIcon,
  TrendingUpIcon,
  UserIcon,
  ZapIcon,
  ThumbsUpIcon,
} from 'lucide-react'

import {
  ServicesSectionWrapper,
  ServicesContainer,
  ServicesHeader,
  SectionHeading,
  SectionDivider,
  ServicesDescription,
  ServicesGrid,
  ServiceCard,
  ServiceIcon,
  ServiceTitle,
  ServiceText,
} from '../../styles/Home/Services.styles'

export const ServicesSection = () => {
  const services = [
    {
      icon: <MicIcon />,
      title: 'Vocal Technique Development',
      description:
        'Master proper breathing, posture, and vocal techniques to improve your overall sound and prevent strain.',
    },
    {
      icon: <TargetIcon />,
      title: 'Range Improvement',
      description:
        'Expand your vocal range and learn to seamlessly transition between registers for greater vocal flexibility.',
    },
    {
      icon: <TrendingUpIcon />,
      title: 'Performance Coaching',
      description:
        'Develop stage presence, overcome performance anxiety, and connect emotionally with your audience.',
    },
    {
      icon: <UserIcon />,
      title: 'Audition Preparation',
      description:
        'Personalized coaching to help you prepare for auditions with confidence and showcase your best abilities.',
    },
    {
      icon: <ZapIcon />,
      title: 'Style Development',
      description:
        'Find your unique voice and develop skills in specific genres from classical to contemporary styles.',
    },
    {
      icon: <ThumbsUpIcon />,
      title: 'Confidence Building',
      description:
        'Build vocal confidence through targeted exercises and supportive feedback in a positive environment.',
    },
  ]

  return (
    <ServicesSectionWrapper id="services">
      <ServicesContainer>
        <ServicesHeader>
          <SectionHeading>Vocal Services</SectionHeading>
          <SectionDivider />
          <ServicesDescription>
            Comprehensive vocal training services designed to help you achieve your singing goals,
            whether you're just starting out or looking to refine your professional skills.
          </ServicesDescription>
        </ServicesHeader>
        <ServicesGrid>
          {services.map((service, index) => (
            <ServiceCard key={index}>
              <ServiceIcon>{service.icon}</ServiceIcon>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceText>{service.description}</ServiceText>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </ServicesContainer>
    </ServicesSectionWrapper>
  )
}
