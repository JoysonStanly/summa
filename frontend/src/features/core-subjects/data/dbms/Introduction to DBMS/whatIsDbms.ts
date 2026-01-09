export const whatIsDbmsContent = {
  carouselImages: [
    'https://static.takeuforward.org/premium/DBMS/Introduction/what-is-dbms-1.jpg',
    'https://static.takeuforward.org/premium/DBMS/Introduction/what-is-dbms-2.jpg',
    'https://static.takeuforward.org/premium/DBMS/Introduction/what-is-dbms-3.jpg',
    'https://static.takeuforward.org/premium/DBMS/Introduction/what-is-dbms-4.jpg',
    'https://static.takeuforward.org/premium/DBMS/Introduction/what-is-dbms-5.jpg'
  ],
  
  htmlContent: `
    <h1 class="mb-4 text-2xl font-bold text-white">What is DBMS?</h1>
    
    <p class="mb-4 leading-relaxed text-gray-300">
      A <b>Database Management System (DBMS)</b> is a software system that enables users to define, create, maintain, and control access to databases. It acts as an interface between the database and end-users or application programs, ensuring that data is consistently organized and remains easily accessible.
    </p>

    <h2 class="mb-3 text-xl font-semibold text-white">Why Do We Need DBMS?</h2>
    <p class="mb-4 text-gray-300">
      Before DBMS, data was stored in file systems which had several limitations:
    </p>
    <ul class="pl-6 mb-6 space-y-2 text-gray-300 list-disc">
      <li><strong class="text-white">Data Redundancy:</strong> Same data stored in multiple files, leading to inconsistency</li>
      <li><strong class="text-white">Data Inconsistency:</strong> Different copies of the same data may have different values</li>
      <li><strong class="text-white">Difficult Data Access:</strong> Writing new programs for each new task</li>
      <li><strong class="text-white">Data Isolation:</strong> Data scattered in various files and formats</li>
      <li><strong class="text-white">Integrity Problems:</strong> Difficult to enforce constraints</li>
      <li><strong class="text-white">Security Problems:</strong> Hard to provide user access to some data but not all</li>
      <li><strong class="text-white">Concurrent Access Anomalies:</strong> Multiple users accessing data simultaneously can cause issues</li>
    </ul>

    <h2 class="mb-3 text-xl font-semibold text-white">Key Features of DBMS</h2>
    <div class="mb-6 space-y-3">
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">1. Data Independence</h3>
        <p class="text-gray-300">Changes in data structure don't affect application programs. DBMS provides both physical and logical data independence.</p>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">2. Data Security</h3>
        <p class="text-gray-300">DBMS provides authentication and authorization mechanisms to ensure only authorized users can access specific data.</p>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">3. Data Integrity</h3>
        <p class="text-gray-300">Maintains accuracy and consistency of data through constraints like primary keys, foreign keys, unique constraints, etc.</p>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">4. Concurrent Access Control</h3>
        <p class="text-gray-300">Multiple users can access the database simultaneously without conflicts through transaction management and locking mechanisms.</p>
      </div>
      
      <div class="p-4 border rounded-lg bg-sidebar/30 border-borders">
        <h3 class="mb-2 text-lg font-semibold text-white">5. Backup and Recovery</h3>
        <p class="text-gray-300">Automatic backup and recovery mechanisms to protect data from system failures.</p>
      </div>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Popular DBMS Examples</h2>
    <div class="grid grid-cols-1 gap-3 mb-6 md:grid-cols-2">
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">MySQL</p>
        <p class="text-sm text-gray-400">Open-source relational DBMS</p>
      </div>
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">PostgreSQL</p>
        <p class="text-sm text-gray-400">Advanced open-source RDBMS</p>
      </div>
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">Oracle Database</p>
        <p class="text-sm text-gray-400">Enterprise-level RDBMS</p>
      </div>
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">MongoDB</p>
        <p class="text-sm text-gray-400">NoSQL document database</p>
      </div>
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">Microsoft SQL Server</p>
        <p class="text-sm text-gray-400">Microsoft's RDBMS solution</p>
      </div>
      <div class="p-3 border rounded-lg bg-sidebar/20 border-borders">
        <p class="font-semibold text-primary">SQLite</p>
        <p class="text-sm text-gray-400">Lightweight embedded database</p>
      </div>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Real-World Analogy</h2>
    <div class="p-4 mb-6 border-l-4 rounded-lg bg-primary/10 border-primary">
      <p class="text-gray-300">
        Think of a DBMS like a <strong class="text-white">library management system</strong>:
      </p>
      <ul class="pl-6 mt-3 space-y-2 text-gray-300 list-disc">
        <li>The <strong class="text-white">librarian</strong> is the DBMS - managing all operations</li>
        <li>The <strong class="text-white">books</strong> are your data - organized and cataloged</li>
        <li>The <strong class="text-white">catalog system</strong> is the schema - defining how data is organized</li>
        <li>The <strong class="text-white">borrowing rules</strong> are constraints - ensuring data integrity</li>
        <li>The <strong class="text-white">member cards</strong> provide access control - security mechanism</li>
      </ul>
    </div>

    <h2 class="mb-3 text-xl font-semibold text-white">Types of DBMS</h2>
    <ol class="pl-6 mb-6 space-y-2 text-gray-300 list-decimal">
      <li><strong class="text-white">Relational DBMS (RDBMS):</strong> Data stored in tables with relationships (MySQL, PostgreSQL)</li>
      <li><strong class="text-white">NoSQL DBMS:</strong> Non-relational databases for unstructured data (MongoDB, Cassandra)</li>
      <li><strong class="text-white">Object-Oriented DBMS:</strong> Data stored as objects (ObjectDB)</li>
      <li><strong class="text-white">Hierarchical DBMS:</strong> Tree-like structure (IBM IMS)</li>
      <li><strong class="text-white">Network DBMS:</strong> Graph-like structure with multiple relationships</li>
    </ol>

    <div class="p-4 mt-6 border rounded-lg bg-sidebar/30 border-borders">
      <p class="text-sm text-gray-400">
        <strong class="text-white">Key Takeaway:</strong> DBMS is essential for modern applications to efficiently store, retrieve, and manage data while ensuring security, integrity, and concurrent access control.
      </p>
    </div>
  `
};
