export const whatIsLldContent = {
  carouselImages: [
    'https://static.takeuforward.org/premium/LLD/Introduction/what-is-lld-1.jpg',
    'https://static.takeuforward.org/premium/LLD/Introduction/what-is-lld-2.jpg',
    'https://static.takeuforward.org/premium/LLD/Introduction/what-is-lld-3.jpg',
    'https://static.takeuforward.org/premium/LLD/Introduction/what-is-lld-4.jpg'
  ],
  
  htmlContent: `
    <h1 class="mb-4 text-2xl font-bold text-white">What is Low Level Design?</h1>
    
    <p class="mb-4 leading-relaxed text-gray-300">
      <b>Low Level Design (LLD)</b> is a component-level design process that follows the High Level Design (HLD) phase. It involves detailed design of individual modules, classes, interfaces, and their interactions. LLD translates the system architecture and design into actual code structure with detailed specifications.
    </p>

    <h2 class="mb-3 text-xl font-semibold text-white">Why is LLD Important?</h2>
    <p class="mb-4 text-gray-300">
      Low Level Design bridges the gap between system architecture (HLD) and implementation (coding). It helps developers understand:
    </p>
    <ul class="pl-6 mb-6 space-y-2 text-gray-300 list-disc">
      <li><strong class="text-white">How to structure code:</strong> Breaking down complex systems into manageable classes and modules</li>
      <li><strong class="text-white">Component interactions:</strong> How different parts of the system communicate</li>
      <li><strong class="text-white">Design patterns:</strong> Proven solutions to common design problems</li>
      <li><strong class="text-white">Code maintainability:</strong> Making code easier to modify and extend</li>
      <li><strong class="text-white">Testability:</strong> Designing components that are easy to test</li>
    </ul>

    <h2 class="mb-3 text-xl font-semibold text-white">HLD vs LLD</h2>
    <div class="mb-6 overflow-x-auto">
      <table class="min-w-full border border-collapse border-borders">
        <thead class="bg-sidebar/50">
          <tr>
            <th class="px-4 py-3 text-left text-white border border-borders">Aspect</th>
            <th class="px-4 py-3 text-left text-white border border-borders">High Level Design (HLD)</th>
            <th class="px-4 py-3 text-left text-white border border-borders">Low Level Design (LLD)</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-sidebar/20">
            <td class="px-4 py-3 border text-primary border-borders">Focus</td>
            <td class="px-4 py-3 border border-borders text-gray-300">System architecture</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Component details</td>
          </tr>
          <tr>
            <td class="px-4 py-3 border text-primary border-borders">Granularity</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Modules, services, databases</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Classes, methods, attributes</td>
          </tr>
          <tr class="bg-sidebar/20">
            <td class="px-4 py-3 border text-primary border-borders">Audience</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Architects, managers</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Developers, testers</td>
          </tr>
          <tr>
            <td class="px-4 py-3 border text-primary border-borders">Diagrams</td>
            <td class="px-4 py-3 border border-borders text-gray-300">System, ER, component diagrams</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Class, sequence diagrams</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Key Components of LLD</h2>
    <div class="mb-6 space-y-3">
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">1. Class Diagrams</h3>
        <p class="text-gray-300">Visual representation of classes, their attributes, methods, and relationships. Shows inheritance, composition, and associations between classes.</p>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">2. Sequence Diagrams</h3>
        <p class="text-gray-300">Illustrates how objects interact over time. Shows the flow of messages between objects to accomplish a specific functionality.</p>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">3. Design Patterns</h3>
        <p class="text-gray-300">Reusable solutions to common design problems. Includes creational (Singleton, Factory), structural (Adapter, Decorator), and behavioral patterns (Observer, Strategy).</p>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">4. Data Structures</h3>
        <p class="text-gray-300">Choice of appropriate data structures for storing and managing data efficiently within each component.</p>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">5. Algorithms</h3>
        <p class="text-gray-300">Detailed logic and algorithms for complex operations within each module or class.</p>
      </div>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">LLD Process Flow</h2>
    <div class="p-4 mb-6 space-y-3 border-l-4 rounded-lg bg-primary/10 border-primary">
      <div class="flex items-start gap-3">
        <span class="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold rounded-full bg-primary text-background">1</span>
        <div>
          <p class="font-semibold text-white">Understand Requirements</p>
          <p class="text-sm text-gray-300">Analyze functional and non-functional requirements from HLD</p>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold rounded-full bg-primary text-background">2</span>
        <div>
          <p class="font-semibold text-white">Identify Classes & Objects</p>
          <p class="text-sm text-gray-300">Break down the system into classes, interfaces, and their relationships</p>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold rounded-full bg-primary text-background">3</span>
        <div>
          <p class="font-semibold text-white">Define Attributes & Methods</p>
          <p class="text-sm text-gray-300">Specify data members and operations for each class</p>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold rounded-full bg-primary text-background">4</span>
        <div>
          <p class="font-semibold text-white">Apply Design Patterns</p>
          <p class="text-sm text-gray-300">Use appropriate design patterns for common problems</p>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold rounded-full bg-primary text-background">5</span>
        <div>
          <p class="font-semibold text-white">Create Diagrams</p>
          <p class="text-sm text-gray-300">Document using UML diagrams (class, sequence, activity)</p>
        </div>
      </div>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Real-World Example: Parking Lot System</h2>
    <div class="p-4 mb-6 rounded-lg bg-sidebar/30">
      <p class="mb-3 text-gray-300"><strong class="text-white">HLD:</strong> System has entry/exit gates, parking spots, payment system</p>
      <p class="mb-3 text-gray-300"><strong class="text-white">LLD:</strong></p>
      <ul class="pl-6 space-y-2 text-gray-300 list-disc">
        <li>Classes: ParkingLot, Vehicle, ParkingSpot, Ticket, Payment</li>
        <li>ParkingSpot has attributes: spotId, spotType, isOccupied</li>
        <li>Methods: parkVehicle(), removeVehicle(), calculateFee()</li>
        <li>Relationships: ParkingLot has many ParkingSpots, Ticket associated with Vehicle</li>
        <li>Design Pattern: Singleton for ParkingLot, Strategy for different payment methods</li>
      </ul>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">SOLID Principles in LLD</h2>
    <div class="grid grid-cols-1 gap-3 mb-6">
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">S - Single Responsibility</p>
        <p class="text-sm text-gray-400">Each class should have only one reason to change</p>
      </div>
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">O - Open/Closed</p>
        <p class="text-sm text-gray-400">Open for extension, closed for modification</p>
      </div>
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">L - Liskov Substitution</p>
        <p class="text-sm text-gray-400">Derived classes must be substitutable for base classes</p>
      </div>
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">I - Interface Segregation</p>
        <p class="text-sm text-gray-400">Many specific interfaces are better than one general interface</p>
      </div>
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">D - Dependency Inversion</p>
        <p class="text-sm text-gray-400">Depend on abstractions, not concrete implementations</p>
      </div>
    </div>

    <div class="p-4 mt-6 border rounded-lg bg-sidebar/30 border-borders">
      <p class="text-sm text-gray-400">
        <strong class="text-white">Key Takeaway:</strong> LLD is crucial for converting architectural designs into implementable code structures. Mastering LLD helps you write clean, maintainable, and scalable code that follows industry best practices.
      </p>
    </div>
  `
};
