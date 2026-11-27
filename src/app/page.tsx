import React from 'react';
import dynamic from 'next/dynamic';
import Hero from '../components/Home/Hero';
import Footer from '@/components/layouts/Footer';
import Navbar from '@/components/layouts/Navbar';

const SectionFallback = () => <div style={{ minHeight: 240 }} aria-hidden="true" />;

const About = dynamic(() => import('../components/Home/About'), { loading: SectionFallback });
const Skills = dynamic(() => import('../components/Home/Skills'), { loading: SectionFallback });
const Projects = dynamic(() => import('../components/Home/Projects'), { loading: SectionFallback });
const Contact = dynamic(() => import('../components/Home/Contact'), { loading: SectionFallback });

const Home: React.FC = () => (
  <>
    <Navbar />
    <main>
      <section id="home">
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="skills">
        <Skills />
      </section>
      <Projects />
      <section id="contact">
        <Contact />
      </section>
    </main>
    <Footer />
  </>
);

export default Home;
