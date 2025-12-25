export interface Slide {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export interface Topic {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'not-started';
  videoUrl?: string;
  duration?: string;
  slides: Slide[];
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  title: string;
  modules: Module[];
}

export const computerNetworkData: Subject = {
  id: 'computer-network',
  title: 'Computer Network',
  modules: [
    {
      id: 'basics-of-networking',
      title: 'Basics of Networking',
      topics: [
        {
          id: 'introduction-to-networks',
          title: 'Introduction to Computer Networks',
          status: 'current',
          videoUrl: '/videos/cn-intro.mp4',
          duration: '18:30',
          slides: [
            {
              id: 'slide-1',
              title: 'What is a Computer Network?',
              content: 'A computer network is a collection of interconnected devices that can communicate and share resources.',
            },
            {
              id: 'slide-2',
              title: 'Types of Networks',
              content: 'LAN, WAN, MAN, PAN - Understanding different network types',
            },
            {
              id: 'slide-3',
              title: 'Network Topologies',
              content: 'Star, Ring, Bus, Mesh, and Hybrid topologies',
            }
          ]
        },
        {
          id: 'osi-model',
          title: 'OSI Model',
          status: 'not-started',
          duration: '25:15',
          slides: []
        },
        {
          id: 'tcp-ip-model',
          title: 'TCP/IP Model',
          status: 'not-started',
          duration: '22:40',
          slides: []
        }
      ]
    },
    {
      id: 'network-protocols',
      title: 'Network Protocols',
      topics: [
        {
          id: 'http-https',
          title: 'HTTP and HTTPS',
          status: 'not-started',
          duration: '20:30',
          slides: []
        },
        {
          id: 'tcp-udp',
          title: 'TCP and UDP',
          status: 'not-started',
          duration: '18:20',
          slides: []
        },
        {
          id: 'dns-dhcp',
          title: 'DNS and DHCP',
          status: 'not-started',
          duration: '16:45',
          slides: []
        }
      ]
    },
    {
      id: 'network-security',
      title: 'Network Security',
      topics: [
        {
          id: 'firewalls',
          title: 'Firewalls and Network Security',
          status: 'not-started',
          duration: '19:30',
          slides: []
        },
        {
          id: 'encryption',
          title: 'Encryption and Cryptography',
          status: 'not-started',
          duration: '24:15',
          slides: []
        }
      ]
    }
  ]
};
