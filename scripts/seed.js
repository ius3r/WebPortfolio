// One-time seed script to populate Services and sample Qualifications
import mongoose from 'mongoose';
import config from '../config/config.js';
import Service from '../server/models/service.model.js';
import Education from '../server/models/education.model.js';
import Project from '../server/models/project.model.js';
import Contact from '../server/models/contact.model.js';
import PortfolioInfo from '../server/models/portfolioinfo.model.js';

async function run() {
  await mongoose.connect(config.mongoUri);
  console.log('Connected for seeding');

  // Drop legacy unique index on Project.email if present (causes E11000 with nulls)
  try {
    await Project.collection.dropIndex('email_1');
    console.log('Dropped legacy unique index: Project.email');
  } catch (e) {
    if (e?.codeName === 'IndexNotFound') {
      // ignore
    } else {
      console.log('Index drop check:', e?.message || e);
    }
  }

  // Drop legacy unique index on Contact.email if present (leads allow duplicates)
  try {
    await Contact.collection.dropIndex('email_1');
    console.log('Dropped legacy unique index: Contact.email');
  } catch (e) {
    if (e?.codeName === 'IndexNotFound') {
      // ignore
    } else {
      console.log('Contact index drop check:', e?.message || e);
    }
  }

  // Seed Services
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      {
        title: 'Game Development',
        description: 'Prototyping and building engaging gameplay systems.',
        checklist: ['Unreal Engine, Unity, Godot', 'C++/C#/GDScript', 'Gameplay mechanics, UI, polish'],
        icon: 'gamepad',
        color: 'amber'
      },
      {
        title: 'Web Development',
        description: 'Modern, performant web apps and sites.',
        checklist: ['REST APIs in NodeJS & Python', 'React front‑ends', 'MERN stack applications'],
        icon: 'code',
        color: 'blue'
      },
      {
        title: 'Automation & Scraping',
        description: 'Python tooling to save time and gather data.',
        checklist: ['Web scraping and data pipelines', 'Bots and task automation', 'AI integrations'],
        icon: 'robot',
        color: 'green'
      }
    ]);
    console.log('Seeded Services');
  } else {
    console.log('Services already exist, skipping');
  }

  // Seed Qualifications (Education)
  const eduCount = await Education.countDocuments();
  if (eduCount === 0) {
    await Education.insertMany([
      {
        title: 'B.Sc. Computer Science',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        completion: new Date('2022-05-15'),
        description: 'Focused on software engineering, algorithms, and systems design.'
      },
      {
        title: 'Certificate in Game Design',
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane.smith@example.com',
        completion: new Date('2023-11-20'),
        description: 'Specialization in gameplay mechanics and level design.'
      }
    ]);
    console.log('Seeded Qualifications');
  } else {
    console.log('Qualifications already exist, skipping');
  }

  // Seed Projects (portfolio)
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany([
      {
        title: 'Imitation Game',
        summary: 'Multiplayer social deduction game (Godot + NodeJS backend).',
        details: 'Focus on emergent gameplay, networking, and smooth UX. Implemented custom lobby, role assignment, and real-time state sync.',
        images: [
          '/projects/imitation1.png','/projects/imitation2.png','/projects/imitation3.png','/projects/imitation4.png','/projects/imitation5.png','/projects/imitation6.png','/projects/imitation7.png','/projects/imitation8.png'
        ]
      },
      {
        title: 'Starvival',
        summary: 'Multiplayer survival game on alien worlds (Unity + Mirror).',
        details: 'Procedural biomes, cooperative resource gathering, and persistence prototype. Optimized network messages and entity interpolation.',
        images: [
          '/projects/starvival1.jpg','/projects/starvival2.jpg','/projects/starvival3.jpg','/projects/starvival4.jpg','/projects/starvival5.jpg','/projects/starvival6.png','/projects/starvival7.png'
        ]
      },
      {
        title: 'Custom Netcode',
        summary: 'Experiment building MMO-capable netcode in Unreal using ENet.',
        details: 'Auth layer, interest management prototype, entity replication experiments, latency compensation tests.',
        images: ['/projects/netcode1.png']
      }
    ]);
    console.log('Seeded Projects');
  } else {
    console.log('Projects already exist, skipping');
  }

  // Seed PortfolioInfo (About + Contact details)
  const infoCount = await PortfolioInfo.countDocuments();
  if (infoCount === 0) {
    await PortfolioInfo.create({
      name: 'Islam Mubarak',
      headline: 'Game & Web Developer',
      bio: 'I’m a self‑taught game developer and a web developer with 4 years of professional experience, holding a B.S. in Computer Science from Helwan University. Worked as a Web Developer for 4 years as a freelancer on Upwork.',
      email: 'dev.islam.tarek@gmail.com',
      phone: '+1 (000) 000-0000',
      location: 'Toronto, Canada',
      github: 'https://github.com/ius3r',
      linkedin: 'https://www.linkedin.com/in/ius3r',
      resumeUrl: '/Resume.pdf',
      avatarUrl: '/photo.jpeg',
      skills: ['Game Development','C++','Unreal Engine','Unity3D','Godot','Web Development','Task Automation','Web Scraping','Python','React','Node.js']
    });
    console.log('Seeded PortfolioInfo');
  } else {
    console.log('PortfolioInfo already exists, skipping');
  }

  await mongoose.disconnect();
  console.log('Seeding complete');
}

run().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
