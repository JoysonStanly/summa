export interface Slide {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export const operatingSystemIntroductionContent = {
  carouselImages: [
    'https://static.takeuforward.org/premium/OS/Introduction/os-intro-1.jpg',
    'https://static.takeuforward.org/premium/OS/Introduction/os-intro-2.jpg',
    'https://static.takeuforward.org/premium/OS/Introduction/os-intro-3.jpg',
    'https://static.takeuforward.org/premium/OS/Introduction/os-intro-4.jpg',
    'https://static.takeuforward.org/premium/OS/Introduction/os-intro-5.jpg'
  ],
  
  htmlContent: `
    <h1 class="mb-4 text-2xl font-bold text-white">What is an Operating System?</h1>
    
    <p class="mb-4 leading-relaxed text-gray-300">
      An <b>Operating System (OS)</b> is <u>system software</u> that acts as an interface between computer hardware and the user. It manages all hardware resources and provides services for computer programs. The OS is the first program loaded into memory when a computer starts up and remains running until the computer is shut down.
    </p>

    <h2 class="mb-3 text-xl font-semibold text-white">Why Do We Need an Operating System?</h2>
    <p class="mb-4 text-gray-300">
      Without an OS, every application would need to include code to handle hardware-specific details like disk operations, memory allocation, and network communication. This would be:
    </p>
    <ul class="pl-6 mb-6 space-y-2 text-gray-300 list-disc">
      <li><strong class="text-white">Inefficient:</strong> Duplicate code in every application</li>
      <li><strong class="text-white">Error-prone:</strong> Direct hardware access can crash the system</li>
      <li><strong class="text-white">Complex:</strong> Developers would need deep hardware knowledge</li>
      <li><strong class="text-white">Insecure:</strong> No protection between programs</li>
      <li><strong class="text-white">Wasteful:</strong> Poor resource utilization</li>
    </ul>

    <h2 class="mb-3 text-xl font-semibold text-white">Functions of an Operating System</h2>
    <div class="mb-6 space-y-3">
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">1. Process Management</h3>
        <p class="mb-2 text-gray-300">Handles creation, scheduling, and termination of processes (programs in execution).</p>
        <ul class="pl-6 space-y-1 text-sm text-gray-400 list-disc">
          <li>CPU scheduling (deciding which process runs when)</li>
          <li>Process synchronization and communication</li>
          <li>Deadlock handling</li>
        </ul>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">2. Memory Management</h3>
        <p class="mb-2 text-gray-300">Manages RAM allocation and deallocation for processes.</p>
        <ul class="pl-6 space-y-1 text-sm text-gray-400 list-disc">
          <li>Keeps track of which parts of memory are in use</li>
          <li>Allocates memory when processes need it</li>
          <li>Deallocates memory when processes finish</li>
          <li>Handles virtual memory and paging</li>
        </ul>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">3. File System Management</h3>
        <p class="mb-2 text-gray-300">Organizes and manages files on storage devices.</p>
        <ul class="pl-6 space-y-1 text-sm text-gray-400 list-disc">
          <li>Creating, reading, writing, and deleting files</li>
          <li>Directory management and navigation</li>
          <li>File permissions and access control</li>
          <li>Disk space management</li>
        </ul>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">4. Device Management</h3>
        <p class="mb-2 text-gray-300">Controls and coordinates all hardware devices.</p>
        <ul class="pl-6 space-y-1 text-sm text-gray-400 list-disc">
          <li>Device driver management</li>
          <li>Input/Output operations</li>
          <li>Buffering and caching</li>
          <li>Device allocation and deallocation</li>
        </ul>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">5. Security Management</h3>
        <p class="mb-2 text-gray-300">Protects the system from unauthorized access.</p>
        <ul class="pl-6 space-y-1 text-sm text-gray-400 list-disc">
          <li>User authentication (login credentials)</li>
          <li>Access control (file permissions)</li>
          <li>Protection from malware and viruses</li>
          <li>Data encryption</li>
        </ul>
      </div>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Types of Operating Systems</h2>
    <div class="mb-6 overflow-x-auto">
      <table class="min-w-full border border-collapse border-borders">
        <thead class="bg-sidebar/50">
          <tr>
            <th class="px-4 py-3 text-left text-white border border-borders">Type</th>
            <th class="px-4 py-3 text-left text-white border border-borders">Description</th>
            <th class="px-4 py-3 text-left text-white border border-borders">Examples</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-sidebar/20">
            <td class="px-4 py-3 border text-primary border-borders">Batch OS</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Groups similar jobs together and executes them in batches</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Payroll systems, Bank statements</td>
          </tr>
          <tr>
            <td class="px-4 py-3 border text-primary border-borders">Time-Sharing OS</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Multiple users share CPU time, giving illusion of simultaneous execution</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Unix, Linux, Windows</td>
          </tr>
          <tr class="bg-sidebar/20">
            <td class="px-4 py-3 border text-primary border-borders">Distributed OS</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Multiple computers work together as a single system</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Cloud computing systems</td>
          </tr>
          <tr>
            <td class="px-4 py-3 border text-primary border-borders">Real-Time OS</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Responds to inputs within a guaranteed time frame</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Medical devices, Aircraft systems</td>
          </tr>
          <tr class="bg-sidebar/20">
            <td class="px-4 py-3 border text-primary border-borders">Mobile OS</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Designed specifically for mobile devices</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Android, iOS</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Operating System Architecture</h2>
    <p class="mb-4 text-gray-300">The OS is typically structured in layers:</p>
    <div class="p-4 mb-6 border rounded-lg bg-sidebar/30 border-borders">
      <div class="space-y-2 text-gray-300">
        <div class="p-2 text-center border rounded bg-primary/20 border-primary">
          <strong>User Applications</strong> (Chrome, Word, Games)
        </div>
        <div class="text-center">↕</div>
        <div class="p-2 text-center border rounded bg-primary/20 border-primary">
          <strong>System Calls & APIs</strong> (Interface between apps and OS)
        </div>
        <div class="text-center">↕</div>
        <div class="p-2 text-center border rounded bg-primary/20 border-primary">
          <strong>Kernel</strong> (Core OS: Process, Memory, File, Device Management)
        </div>
        <div class="text-center">↕</div>
        <div class="p-2 text-center border rounded bg-primary/20 border-primary">
          <strong>Hardware</strong> (CPU, RAM, Disk, I/O Devices)
        </div>
      </div>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Real-World Analogy: Restaurant Manager</h2>
    <div class="p-4 mb-6 border-l-4 rounded-lg bg-primary/10 border-primary">
      <p class="mb-3 text-gray-300">
        Think of an Operating System like a <strong class="text-white">Restaurant Manager</strong>:
      </p>
      <ul class="pl-6 space-y-2 text-gray-300 list-disc">
        <li><strong class="text-white">Process Management:</strong> Assigns waiters to tables (CPU to processes)</li>
        <li><strong class="text-white">Memory Management:</strong> Allocates tables to customers (RAM to programs)</li>
        <li><strong class="text-white">File System:</strong> Organizes recipes and inventory (data storage)</li>
        <li><strong class="text-white">Device Management:</strong> Coordinates kitchen equipment (hardware)</li>
        <li><strong class="text-white">Security:</strong> Checks reservations and handles payments (authentication)</li>
      </ul>
      <p class="mt-3 text-sm text-gray-400">
        Just like a manager ensures smooth restaurant operations, the OS ensures your computer runs efficiently!
      </p>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Popular Operating Systems</h2>
    <div class="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4">
      <div class="p-3 text-center border rounded-lg bg-sidebar/20 border-borders">
        <p class="mb-1 font-semibold text-white">Windows</p>
        <p class="text-xs text-gray-400">Desktop/Enterprise</p>
      </div>
      <div class="p-3 text-center border rounded-lg bg-sidebar/20 border-borders">
        <p class="mb-1 font-semibold text-white">Linux</p>
        <p class="text-xs text-gray-400">Servers/Development</p>
      </div>
      <div class="p-3 text-center border rounded-lg bg-sidebar/20 border-borders">
        <p class="mb-1 font-semibold text-white">macOS</p>
        <p class="text-xs text-gray-400">Apple Devices</p>
      </div>
      <div class="p-3 text-center border rounded-lg bg-sidebar/20 border-borders">
        <p class="mb-1 font-semibold text-white">Android/iOS</p>
        <p class="text-xs text-gray-400">Mobile Devices</p>
      </div>
    </div>

    <div class="p-4 mt-6 border rounded-lg bg-sidebar/30 border-borders">
      <p class="text-sm text-gray-400">
        <strong class="text-white">Key Takeaway:</strong> The Operating System is the backbone of any computer system. It abstracts hardware complexity, provides essential services to applications, and ensures efficient resource utilization. Understanding OS concepts is crucial for any software developer or IT professional.
      </p>
    </div>
  `
};
