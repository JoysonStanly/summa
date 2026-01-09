export const whatIsComputerNetworkContent = {
  carouselImages: [
    'https://static.takeuforward.org/premium/CN/Introduction/what-is-cn-1.jpg',
    'https://static.takeuforward.org/premium/CN/Introduction/what-is-cn-2.jpg',
    'https://static.takeuforward.org/premium/CN/Introduction/what-is-cn-3.jpg',
    'https://static.takeuforward.org/premium/CN/Introduction/what-is-cn-4.jpg',
    'https://static.takeuforward.org/premium/CN/Introduction/what-is-cn-5.jpg'
  ],
  
  htmlContent: `
    <h1 class="mb-4 text-2xl font-bold text-white">What is Computer Network?</h1>
    
    <p class="mb-4 leading-relaxed text-gray-300">
      A <b>Computer Network</b> is a collection of interconnected computing devices that can communicate and share resources with each other. These devices include computers, servers, smartphones, printers, and other hardware connected through wired or wireless communication channels.
    </p>

    <h2 class="mb-3 text-xl font-semibold text-white">Why Do We Need Computer Networks?</h2>
    <ul class="pl-6 mb-6 space-y-2 text-gray-300 list-disc">
      <li><strong class="text-white">Resource Sharing:</strong> Share hardware (printers, scanners) and software resources efficiently</li>
      <li><strong class="text-white">Data Communication:</strong> Transfer files, messages, and data between devices</li>
      <li><strong class="text-white">Remote Access:</strong> Access data and applications from anywhere</li>
      <li><strong class="text-white">Reliability:</strong> Backup and redundancy through multiple paths</li>
      <li><strong class="text-white">Cost Reduction:</strong> Share expensive resources instead of buying for each user</li>
      <li><strong class="text-white">Collaboration:</strong> Enable teamwork through shared applications and data</li>
    </ul>

    <h2 class="mb-3 text-xl font-semibold text-white">Types of Computer Networks</h2>
    <div class="mb-6 space-y-3">
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">1. LAN (Local Area Network)</h3>
        <p class="mb-2 text-gray-300">Covers a small geographical area like a building or campus.</p>
        <p class="text-sm text-gray-400"><strong>Examples:</strong> Office network, School computer lab, Home Wi-Fi</p>
        <p class="text-sm text-gray-400"><strong>Range:</strong> Up to 1 km</p>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">2. MAN (Metropolitan Area Network)</h3>
        <p class="mb-2 text-gray-300">Spans across a city or large campus.</p>
        <p class="text-sm text-gray-400"><strong>Examples:</strong> City-wide network, Cable TV network</p>
        <p class="text-sm text-gray-400"><strong>Range:</strong> 10-100 km</p>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">3. WAN (Wide Area Network)</h3>
        <p class="mb-2 text-gray-300">Covers large geographical areas like countries or continents.</p>
        <p class="text-sm text-gray-400"><strong>Examples:</strong> Internet, Corporate networks across cities</p>
        <p class="text-sm text-gray-400"><strong>Range:</strong> Unlimited</p>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">4. PAN (Personal Area Network)</h3>
        <p class="mb-2 text-gray-300">Very small network for personal devices.</p>
        <p class="text-sm text-gray-400"><strong>Examples:</strong> Bluetooth connections, USB connections</p>
        <p class="text-sm text-gray-400"><strong>Range:</strong> 1-10 meters</p>
      </div>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Network Components</h2>
    <div class="grid grid-cols-1 gap-3 mb-6 md:grid-cols-2">
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">Router</p>
        <p class="text-sm text-gray-400">Connects different networks and routes data packets</p>
      </div>
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">Switch</p>
        <p class="text-sm text-gray-400">Connects devices within a network</p>
      </div>
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">Hub</p>
        <p class="text-sm text-gray-400">Basic device to connect multiple devices (broadcasts to all)</p>
      </div>
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">Modem</p>
        <p class="text-sm text-gray-400">Modulates and demodulates signals for internet connection</p>
      </div>
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">Access Point</p>
        <p class="text-sm text-gray-400">Provides wireless connectivity to devices</p>
      </div>
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">Firewall</p>
        <p class="text-sm text-gray-400">Security device to monitor and control network traffic</p>
      </div>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Network Architecture Models</h2>
    <div class="mb-6 space-y-3">
      <div class="p-4 border-l-4 rounded-lg bg-primary/10 border-primary">
        <h3 class="mb-2 font-semibold text-white">Client-Server Architecture</h3>
        <p class="text-gray-300">Centralized model where clients request services from dedicated servers.</p>
        <p class="mt-2 text-sm text-gray-400"><strong>Pros:</strong> Better security, centralized control, easier management</p>
        <p class="text-sm text-gray-400"><strong>Cons:</strong> Server dependency, higher cost, single point of failure</p>
      </div>
      
      <div class="p-4 border-l-4 rounded-lg bg-primary/10 border-primary">
        <h3 class="mb-2 font-semibold text-white">Peer-to-Peer (P2P) Architecture</h3>
        <p class="text-gray-300">Decentralized model where all devices have equal privileges.</p>
        <p class="mt-2 text-sm text-gray-400"><strong>Pros:</strong> No server cost, no single point of failure, scalable</p>
        <p class="text-sm text-gray-400"><strong>Cons:</strong> Security issues, difficult to manage, inconsistent performance</p>
      </div>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Transmission Media</h2>
    <div class="mb-6 overflow-x-auto">
      <table class="min-w-full border border-collapse border-borders">
        <thead class="bg-sidebar/50">
          <tr>
            <th class="px-4 py-3 text-left text-white border border-borders">Type</th>
            <th class="px-4 py-3 text-left text-white border border-borders">Examples</th>
            <th class="px-4 py-3 text-left text-white border border-borders">Characteristics</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-sidebar/20">
            <td class="px-4 py-3 font-semibold border text-primary border-borders">Guided Media</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Twisted Pair, Coaxial Cable, Fiber Optic</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Physical wires, higher security</td>
          </tr>
          <tr>
            <td class="px-4 py-3 font-semibold border text-primary border-borders">Unguided Media</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Radio Waves, Microwaves, Infrared</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Wireless, flexible, less secure</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Real-World Analogy</h2>
    <div class="p-4 mb-6 border-l-4 rounded-lg bg-primary/10 border-primary">
      <p class="text-gray-300">
        Think of a computer network like a <strong class="text-white">postal system</strong>:
      </p>
      <ul class="pl-6 mt-3 space-y-2 text-gray-300 list-disc">
        <li>The <strong class="text-white">devices</strong> are houses and offices - sending and receiving information</li>
        <li>The <strong class="text-white">cables/wireless</strong> are roads - pathways for data to travel</li>
        <li>The <strong class="text-white">routers</strong> are post offices - directing data to the correct destination</li>
        <li>The <strong class="text-white">IP addresses</strong> are mailing addresses - unique identifiers for each device</li>
        <li>The <strong class="text-white">protocols</strong> are postal rules - standards for how data should be packaged and sent</li>
      </ul>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Key Network Metrics</h2>
    <ol class="pl-6 mb-6 space-y-2 text-gray-300 list-decimal">
      <li><strong class="text-white">Bandwidth:</strong> Maximum rate of data transfer (measured in bps, Mbps, Gbps)</li>
      <li><strong class="text-white">Latency:</strong> Time delay in data transmission (measured in milliseconds)</li>
      <li><strong class="text-white">Throughput:</strong> Actual rate of successful data transfer</li>
      <li><strong class="text-white">Jitter:</strong> Variation in packet arrival time</li>
      <li><strong class="text-white">Packet Loss:</strong> Percentage of packets that fail to reach destination</li>
    </ol>

    <div class="p-4 mt-6 border rounded-lg bg-sidebar/30 border-borders">
      <p class="text-sm text-gray-400">
        <strong class="text-white">Key Takeaway:</strong> Computer networks are the backbone of modern communication and information sharing. Understanding network fundamentals is essential for working with any internet-connected application or service.
      </p>
    </div>
  `
};
