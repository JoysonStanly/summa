export const introductionToOopsContent = {
  carouselImages: [
    'https://static.takeuforward.org/premium/OOPs/Introduction/intro-to-oops-1.jpg',
    'https://static.takeuforward.org/premium/OOPs/Introduction/intro-to-oops-2.jpg',
    'https://static.takeuforward.org/premium/OOPs/Introduction/intro-to-oops-3.jpg',
    'https://static.takeuforward.org/premium/OOPs/Introduction/intro-to-oops-4.jpg',
    'https://static.takeuforward.org/premium/OOPs/Introduction/intro-to-oops-5.jpg'
  ],
  
  htmlContent: `
    <h1 class="mb-4 text-2xl font-bold text-white">Introduction to Object-Oriented Programming (OOPs)</h1>
    
    <p class="mb-4 leading-relaxed text-gray-300">
      <b>Object-Oriented Programming (OOPs)</b> is a programming paradigm that organizes code around <u>objects</u> rather than functions and logic. It focuses on creating reusable code by modeling real-world entities as objects that contain both data (attributes) and behavior (methods).
    </p>

    <h2 class="mb-3 text-xl font-semibold text-white">Why OOPs?</h2>
    <p class="mb-4 text-gray-300">
      Before OOPs, we had <strong>Procedural Programming</strong> where programs were written as sequences of instructions. This approach had limitations:
    </p>
    <ul class="pl-6 mb-6 space-y-2 text-gray-300 list-disc">
      <li><strong class="text-white">Code Reusability:</strong> Difficult to reuse code across different programs</li>
      <li><strong class="text-white">Maintenance:</strong> Hard to modify large programs without breaking functionality</li>
      <li><strong class="text-white">Data Security:</strong> Global data could be accessed from anywhere</li>
      <li><strong class="text-white">Real-World Modeling:</strong> Difficult to model complex real-world scenarios</li>
      <li><strong class="text-white">Scalability:</strong> Large projects became unmanageable</li>
    </ul>

    <h2 class="mb-3 text-xl font-semibold text-white">Procedural vs Object-Oriented Programming</h2>
    <div class="mb-6 overflow-x-auto">
      <table class="min-w-full border border-collapse border-borders">
        <thead class="bg-sidebar/50">
          <tr>
            <th class="px-4 py-3 text-left text-white border border-borders">Aspect</th>
            <th class="px-4 py-3 text-left text-white border border-borders">Procedural Programming</th>
            <th class="px-4 py-3 text-left text-white border border-borders">Object-Oriented Programming</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-sidebar/20">
            <td class="px-4 py-3 border text-primary border-borders">Focus</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Functions/Procedures</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Objects/Classes</td>
          </tr>
          <tr>
            <td class="px-4 py-3 border text-primary border-borders">Data Access</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Global data accessible everywhere</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Data encapsulated within objects</td>
          </tr>
          <tr class="bg-sidebar/20">
            <td class="px-4 py-3 border text-primary border-borders">Approach</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Top-down</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Bottom-up</td>
          </tr>
          <tr>
            <td class="px-4 py-3 border text-primary border-borders">Examples</td>
            <td class="px-4 py-3 border border-borders text-gray-300">C, Pascal, FORTRAN</td>
            <td class="px-4 py-3 border border-borders text-gray-300">Java, C++, Python, JavaScript</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Core Concepts of OOPs</h2>
    <div class="mb-6 space-y-3">
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">1. Class</h3>
        <p class="text-gray-300">A blueprint or template for creating objects. It defines the structure (attributes) and behavior (methods) that objects will have.</p>
        <div class="p-3 mt-2 font-mono text-sm rounded bg-background/50">
          <span class="text-primary">class</span> <span class="text-white">Car</span> {<br/>
          &nbsp;&nbsp;<span class="text-gray-400">// Attributes</span><br/>
          &nbsp;&nbsp;<span class="text-primary">String</span> brand;<br/>
          &nbsp;&nbsp;<span class="text-primary">int</span> speed;<br/>
          <br/>
          &nbsp;&nbsp;<span class="text-gray-400">// Methods</span><br/>
          &nbsp;&nbsp;<span class="text-primary">void</span> accelerate() { }<br/>
          }
        </div>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">2. Object</h3>
        <p class="text-gray-300">An instance of a class. It represents a real-world entity with specific values for the attributes defined in the class.</p>
        <div class="p-3 mt-2 font-mono text-sm rounded bg-background/50">
          <span class="text-white">Car</span> myCar = <span class="text-primary">new</span> <span class="text-white">Car</span>();<br/>
          myCar.brand = <span class="text-green-400">"Toyota"</span>;<br/>
          myCar.speed = <span class="text-yellow-400">60</span>;
        </div>
      </div>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">The Four Pillars of OOPs</h2>
    <div class="grid grid-cols-1 gap-3 mb-6 md:grid-cols-2">
      <div class="p-4 border rounded-lg bg-primary/10 border-primary">
        <h3 class="mb-2 font-semibold text-white">1. Encapsulation</h3>
        <p class="text-sm text-gray-300">Bundling data and methods together, hiding internal details from the outside world.</p>
        <p class="mt-2 text-xs text-gray-400">Example: Private variables with public getter/setter methods</p>
      </div>
      
      <div class="p-4 border rounded-lg bg-primary/10 border-primary">
        <h3 class="mb-2 font-semibold text-white">2. Abstraction</h3>
        <p class="text-sm text-gray-300">Showing only essential features while hiding complex implementation details.</p>
        <p class="mt-2 text-xs text-gray-400">Example: Using a TV remote without knowing internal circuits</p>
      </div>
      
      <div class="p-4 border rounded-lg bg-primary/10 border-primary">
        <h3 class="mb-2 font-semibold text-white">3. Inheritance</h3>
        <p class="text-sm text-gray-300">Creating new classes from existing ones, inheriting properties and behaviors.</p>
        <p class="mt-2 text-xs text-gray-400">Example: Electric Car inherits from Car class</p>
      </div>
      
      <div class="p-4 border rounded-lg bg-primary/10 border-primary">
        <h3 class="mb-2 font-semibold text-white">4. Polymorphism</h3>
        <p class="text-sm text-gray-300">Ability of objects to take multiple forms - same interface, different implementations.</p>
        <p class="mt-2 text-xs text-gray-400">Example: Different animals make different sounds through speak() method</p>
      </div>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Benefits of OOPs</h2>
    <ol class="pl-6 mb-6 space-y-2 text-gray-300 list-decimal">
      <li><strong class="text-white">Modularity:</strong> Code is organized into self-contained objects</li>
      <li><strong class="text-white">Reusability:</strong> Classes can be reused across different programs</li>
      <li><strong class="text-white">Flexibility:</strong> Easy to modify and extend existing code</li>
      <li><strong class="text-white">Maintainability:</strong> Changes in one part don't affect other parts</li>
      <li><strong class="text-white">Security:</strong> Data hiding through encapsulation protects sensitive information</li>
      <li><strong class="text-white">Problem Solving:</strong> Models real-world scenarios more naturally</li>
    </ol>

    <h2 class="mb-3 text-xl font-semibold text-white">Real-World Analogy</h2>
    <div class="p-4 mb-6 border-l-4 rounded-lg bg-primary/10 border-primary">
      <p class="mb-3 text-gray-300">
        Think of OOPs like building with <strong class="text-white">LEGO blocks</strong>:
      </p>
      <ul class="pl-6 space-y-2 text-gray-300 list-disc">
        <li><strong class="text-white">Class</strong> = The blueprint/design of a LEGO piece</li>
        <li><strong class="text-white">Object</strong> = Individual LEGO pieces you can hold and use</li>
        <li><strong class="text-white">Encapsulation</strong> = Each piece has its specific shape and connection points (internal structure hidden)</li>
        <li><strong class="text-white">Inheritance</strong> = Special pieces (wheels, windows) are types of basic blocks</li>
        <li><strong class="text-white">Polymorphism</strong> = Different pieces can connect in the same way but look different</li>
        <li><strong class="text-white">Abstraction</strong> = You use pieces without knowing how plastic was molded</li>
      </ul>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Simple Example: Bank Account</h2>
    <div class="p-4 mb-6 rounded-lg bg-sidebar/30">
      <div class="p-3 mb-3 font-mono text-sm rounded bg-background/50">
        <span class="text-primary">class</span> <span class="text-white">BankAccount</span> {<br/>
        &nbsp;&nbsp;<span class="text-gray-400">// Private attributes (Encapsulation)</span><br/>
        &nbsp;&nbsp;<span class="text-primary">private</span> String accountNumber;<br/>
        &nbsp;&nbsp;<span class="text-primary">private</span> double balance;<br/>
        <br/>
        &nbsp;&nbsp;<span class="text-gray-400">// Constructor</span><br/>
        &nbsp;&nbsp;<span class="text-primary">public</span> BankAccount(String accNum) {<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;accountNumber = accNum;<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;balance = <span class="text-yellow-400">0.0</span>;<br/>
        &nbsp;&nbsp;}<br/>
        <br/>
        &nbsp;&nbsp;<span class="text-gray-400">// Public methods</span><br/>
        &nbsp;&nbsp;<span class="text-primary">public void</span> deposit(<span class="text-primary">double</span> amount) {<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;balance += amount;<br/>
        &nbsp;&nbsp;}<br/>
        <br/>
        &nbsp;&nbsp;<span class="text-primary">public double</span> getBalance() {<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-primary">return</span> balance;<br/>
        &nbsp;&nbsp;}<br/>
        }
      </div>
      <p class="text-sm text-gray-400">
        This example shows <strong class="text-white">encapsulation</strong> - data (balance) is private, accessible only through public methods (deposit, getBalance).
      </p>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Popular OOP Languages</h2>
    <div class="grid grid-cols-2 gap-3 mb-6 md:grid-cols-3">
      <div class="p-3 text-center border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">Java</p>
      </div>
      <div class="p-3 text-center border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">C++</p>
      </div>
      <div class="p-3 text-center border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">Python</p>
      </div>
      <div class="p-3 text-center border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">C#</p>
      </div>
      <div class="p-3 text-center border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">JavaScript</p>
      </div>
      <div class="p-3 text-center border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">Ruby</p>
      </div>
    </div>

    <div class="p-4 mt-6 border rounded-lg bg-sidebar/30 border-borders">
      <p class="text-sm text-gray-400">
        <strong class="text-white">Key Takeaway:</strong> OOPs is a fundamental programming paradigm that makes code more organized, reusable, and maintainable. Mastering OOPs concepts is essential for modern software development and system design.
      </p>
    </div>
  `
};
