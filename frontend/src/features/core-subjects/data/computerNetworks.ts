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
  problems?: { id: string; name: string; isCompleted?: boolean }[];
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
  problems?: { id: string; name: string; isCompleted?: boolean }[];
}

export interface Subject {
  id: string;
  title: string;
  modules: Module[];
}

export const computerNetworksData: Subject = {
  id: 'computer-networks',
  title: 'Computer Networks',
  modules: [
    {
      id: 'introduction-to-networks',
      title: 'Introduction to Networks',
      problems: [
        { id: 'what-is-computer-network', name: 'What is Computer Network?', isCompleted: false },
        { id: 'network-topologies', name: 'Network Topologies', isCompleted: false },
        { id: 'osi-model', name: 'OSI Model', isCompleted: false }
      ],
      topics: []
    },
    {
      id: 'data-link-layer',
      title: 'Data Link Layer',
      problems: [
        { id: 'framing', name: 'Framing', isCompleted: false },
        { id: 'error-detection', name: 'Error Detection and Correction', isCompleted: false },
        { id: 'flow-control', name: 'Flow Control', isCompleted: false }
      ],
      topics: []
    },
    {
      id: 'network-layer',
      title: 'Network Layer',
      problems: [
        { id: 'ip-addressing', name: 'IP Addressing', isCompleted: false },
        { id: 'routing-algorithms', name: 'Routing Algorithms', isCompleted: false },
        { id: 'ipv4-vs-ipv6', name: 'IPv4 vs IPv6', isCompleted: false }
      ],
      topics: []
    },
    {
      id: 'transport-layer',
      title: 'Transport Layer',
      problems: [
        { id: 'tcp-vs-udp', name: 'TCP vs UDP', isCompleted: false },
        { id: 'congestion-control', name: 'Congestion Control', isCompleted: false },
        { id: 'three-way-handshake', name: 'Three-Way Handshake', isCompleted: false }
      ],
      topics: []
    }
  ]
};

export const findTopicByPath = (subjectId: string, moduleId: string, topicId: string): Topic | null => {
  if (subjectId === 'computer-networks') {
    const module = computerNetworksData.modules.find(m => m.id === moduleId);
    if (module) {
      return module.topics.find(t => t.id === topicId) || null;
    }
  }
  return null;
};

export const findModuleByPath = (subjectId: string, moduleId: string): Module | null => {
  if (subjectId === 'computer-networks') {
    return computerNetworksData.modules.find(m => m.id === moduleId) || null;
  }
  return null;
};
