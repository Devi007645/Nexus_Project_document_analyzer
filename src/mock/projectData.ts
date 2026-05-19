import { Project, AuthUser } from '../types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-fintech-01',
    status: 'completed',
    name: 'Fintech Core Ledger Modernization',
    clientName: 'Aegis Global Banking',
    clientIndustry: 'Financial Services & Payments',
    aiSummary: 'Complete architectural migration from legacy COBOL mainframe systems to a distributed event-driven microservices architecture supporting real-time cross-border settlements, ISO 20022 messaging standards, and automated compliance auditing.',
    complexityScore: 89,
    estimatedTotalWeeks: 36,
    recommendedTechStack: ['Next.js 15', 'Go', 'Kafka', 'PostgreSQL', 'Redis Cluster', 'AWS EKS', 'Temporal.io'],
    createdAt: '2026-01-14T08:30:00Z',
    updatedAt: '2026-02-28T14:22:00Z',
    documentsCount: 14,
    risks: [
      {
        id: 'risk-1',
        title: 'Legacy Mainframe Data Ingestion Latency',
        impact: 'High',
        probability: 'High',
        mitigationStrategy: 'Implement CDC (Change Data Capture) via Debezium pipelines to replicate mainframe logs into Apache Kafka without direct polling overhead.'
      },
      {
        id: 'risk-2',
        title: 'Strict ISO 20022 Compliance Verification',
        impact: 'Critical',
        probability: 'Medium',
        mitigationStrategy: 'Build automated XML schema validation middleware in the API Gateway layer prior to ledger state transitions.'
      },
      {
        id: 'risk-3',
        title: 'Zero-Downtime Migration Window',
        impact: 'Critical',
        probability: 'Medium',
        mitigationStrategy: 'Execute dual-writing phase for 45 days with automated reconciliation runners comparing ledger balances.'
      }
    ],
    requirements: [
      {
        id: 'req-1',
        code: 'REQ-CORE-001',
        title: 'Dual-Entry Immutable Ledger Engine',
        description: 'The accounting engine must guarantee cryptographic immutability and atomic double-entry bookkeeping transactions with microsecond latency.',
        category: 'Functional',
        priority: 'P0',
        status: 'Verified',
        estimatedComplexity: 'Extreme',
        citations: [
          {
            documentId: 'doc-101',
            documentName: 'Aegis_Architecture_RFP_v4.pdf',
            pageNumber: 18,
            sectionTitle: '3.2 Ledger Subsystem Requirements',
            originalText: 'All debit and credit pairs must commit atomically to the primary PostgreSQL cluster and publish verification events to Kafka topic account.ledger.v1.',
            confidenceScore: 0.99
          }
        ],
        dependencies: []
      },
      {
        id: 'req-2',
        code: 'REQ-SEC-002',
        title: 'mTLS & OAuth2 Token Exchange',
        description: 'All internal inter-service RPC calls must enforce mutual TLS 1.3 encryption and short-lived JWT validation.',
        category: 'Non-functional',
        priority: 'P0',
        status: 'In Progress',
        estimatedComplexity: 'High',
        citations: [
          {
            documentId: 'doc-102',
            documentName: 'Security_Compliance_Addendum_2026.docx',
            pageNumber: 5,
            sectionTitle: '1.1 Transport Layer Protections',
            originalText: 'Services within the Kubernetes mesh must reject any unauthenticated plaintext traffic. Cert-manager must automatically rotate certificates every 30 days.',
            confidenceScore: 0.96
          }
        ],
        dependencies: ['REQ-CORE-001']
      },
      {
        id: 'req-3',
        code: 'REQ-INT-003',
        title: 'SWIFT & FedNow API Gateway Adapter',
        description: 'Asynchronous webhook listeners to process incoming FedNow instant settlement messages and SWIFT MT/MX payload conversions.',
        category: 'Integrations',
        priority: 'P1',
        status: 'Pending AI Review',
        estimatedComplexity: 'High',
        citations: [
          {
            documentId: 'doc-103',
            documentName: 'External_Gateway_Specs_Draft.md',
            pageNumber: 1,
            sectionTitle: 'FedNow Webhook Handlers',
            originalText: 'Payload validation must parse JSON Web Signatures (JWS) from Federal Reserve endpoints before initiating credit transfers.',
            confidenceScore: 0.94
          }
        ],
        dependencies: ['REQ-CORE-001']
      },
      {
        id: 'req-4',
        code: 'REQ-CON-004',
        title: '99.999% SLA Uptime Constraint',
        description: 'Core transaction processing must not exceed 5.26 minutes of unplanned downtime per calendar year across multi-region active-active clusters.',
        category: 'Constraints',
        priority: 'P0',
        status: 'In Progress',
        estimatedComplexity: 'Extreme',
        citations: [
          {
            documentId: 'doc-101',
            documentName: 'Aegis_Architecture_RFP_v4.pdf',
            pageNumber: 42,
            sectionTitle: '7.1 Service Level Agreements',
            originalText: 'System failover across AWS us-east-1 and us-west-2 must occur within 3000ms with zero data loss (RPO=0).',
            confidenceScore: 0.98
          }
        ],
        dependencies: []
      },
      {
        id: 'req-5',
        code: 'REQ-UI-005',
        title: 'Executive Treasury Dashboard UI',
        description: 'Provide an enterprise portal for CFOs to monitor liquidity ratios, real-time risk exposure, and trigger manual audit holds.',
        category: 'Functional',
        priority: 'P2',
        status: 'Pending AI Review',
        estimatedComplexity: 'Medium',
        citations: [
          {
            documentId: 'doc-104',
            documentName: 'UX_UI_Client_Interviews.txt',
            pageNumber: 3,
            sectionTitle: 'Interview 4: Treasury VP',
            originalText: 'VP requested dark-mode native charts with customizable alerting thresholds for foreign currency fluctuations.',
            confidenceScore: 0.91
          }
        ],
        dependencies: ['REQ-CORE-001']
      }
    ],
    timeline: [
      {
        id: 'ms-1',
        phase: 'Phase 1: Ingestion & Architecture Setup',
        title: 'Core Infrastructure & Kafka Mesh Initialization',
        deliverables: ['Terraform scripts for EKS clusters', 'Kafka brokers with Schema Registry', 'mTLS cert manager deployment'],
        estimatedDurationWeeks: 6,
        startDate: '2026-03-01',
        endDate: '2026-04-12',
        status: 'Completed',
        assigneeRole: 'Platform Infrastructure Team',
        dependencies: []
      },
      {
        id: 'ms-2',
        phase: 'Phase 2: Data Replication & Ledger Engine',
        title: 'Mainframe CDC Sync & Postgres Ledger Engine',
        deliverables: ['Debezium CDC connectors', 'Double-entry Go microservice', 'Automated reconciliation test suite'],
        estimatedDurationWeeks: 10,
        startDate: '2026-04-15',
        endDate: '2026-06-25',
        status: 'In Progress',
        assigneeRole: 'Backend Core Team',
        dependencies: ['ms-1']
      },
      {
        id: 'ms-3',
        phase: 'Phase 3: Integration & Payment Adapters',
        title: 'SWIFT/FedNow Webhooks & Compliance Validation',
        deliverables: ['ISO 20022 XML parsers', 'FedNow JWS verification service', 'Audit logging archival workers'],
        estimatedDurationWeeks: 8,
        startDate: '2026-07-01',
        endDate: '2026-08-25',
        status: 'Not Started',
        assigneeRole: 'Integrations Squad',
        dependencies: ['ms-2']
      },
      {
        id: 'ms-4',
        phase: 'Phase 4: Client Portal & Security Audits',
        title: 'Treasury Dashboard Frontend & Pen-Testing',
        deliverables: ['Next.js App Router UI', 'Real-time WebSocket telemetry', 'Third-party SOC2 Type II audit'],
        estimatedDurationWeeks: 8,
        startDate: '2026-09-01',
        endDate: '2026-10-31',
        status: 'Not Started',
        assigneeRole: 'Frontend & Security Teams',
        dependencies: ['ms-2', 'ms-3']
      }
    ],
    apiEndpoints: [
      {
        id: 'ep-1',
        method: 'POST',
        path: '/v1/ledger/transactions',
        summary: 'Record a double-entry ledger transaction',
        description: 'Creates a cryptographically verifiable journal entry transferring funds between debit and credit accounts.',
        authRequired: true,
        requestPayloadExample: JSON.stringify({
          transactionReference: "TX-20260315-99812",
          sourceAccount: "ACC-88129301",
          destinationAccount: "ACC-00412899",
          amount: 1500000.00,
          currency: "USD",
          metadata: { purpose: "Cross-border settlement", swiftCode: "AEGISUS33" }
        }, null, 2),
        responsePayloadExample: JSON.stringify({
          status: "COMMITTED",
          ledgerEntryId: "LEDG-887162938102",
          timestamp: "2026-03-15T14:22:11.004Z",
          merkleRootHash: "0x8fae8910bc4421aa0019283748"
        }, null, 2)
      },
      {
        id: 'ep-2',
        method: 'GET',
        path: '/v1/accounts/{accountId}/balance',
        summary: 'Get real-time account balances',
        description: 'Retrieves current ledger balance, available pending balance, and holds.',
        authRequired: true,
        responsePayloadExample: JSON.stringify({
          accountId: "ACC-88129301",
          currency: "USD",
          availableBalance: 42800500.25,
          heldBalance: 1200000.00,
          lastUpdatedAt: "2026-03-15T14:22:11.004Z"
        }, null, 2)
      },
      {
        id: 'ep-3',
        method: 'POST',
        path: '/v1/webhooks/fednow/settle',
        summary: 'Incoming FedNow instant payment notification',
        description: 'Processes JWS signed instant transfer webhook payload from Federal Reserve gateway.',
        authRequired: true,
        requestPayloadExample: JSON.stringify({
          messageId: "FED-2026-99018",
          fedNowReference: "FN-00129-8819",
          debtorName: "Bank of America",
          creditorName: "Aegis Global Banking",
          settledAmount: 45000.00,
          settledCurrency: "USD"
        }, null, 2),
        responsePayloadExample: JSON.stringify({
          status: "ACKNOWLEDGED",
          internalReferenceId: "TX-FED-9912",
          processingTimeMs: 12.4
        }, null, 2)
      }
    ],
    architecture: {
      suggestedServices: [
        {
          name: 'Ledger Engine Core',
          type: 'Backend Microservice',
          description: 'High-throughput double-entry validation engine written in Go.',
          tech: ['Go', 'gRPC', 'PostgreSQL', 'Temporal']
        },
        {
          name: 'API Security Gateway',
          type: 'Gateway',
          description: 'Envoy-based reverse proxy handling mTLS, OAuth2 verification, and rate limiting.',
          tech: ['Envoy', 'Kong', 'Redis', 'OAuth2']
        },
        {
          name: 'Kafka Event Mesh',
          type: 'Data Pipeline',
          description: 'Enterprise event bus for audit logging, Webhook broadcasts, and CDC streams.',
          tech: ['Apache Kafka', 'Debezium', 'Schema Registry']
        },
        {
          name: 'Treasury Web App',
          type: 'Frontend',
          description: 'Executive dashboard with live web socket feeds and advanced analytical charts.',
          tech: ['Next.js 15', 'TailwindCSS', 'Zustand', 'Shadcn UI']
        }
      ],
      databases: [
        {
          name: 'Aurora PostgreSQL Primary',
          type: 'Relational',
          purpose: 'ACID transactional ledger records and account balances.'
        },
        {
          name: 'Redis Enterprise Cluster',
          type: 'Cache',
          purpose: 'High-speed idempotency keys and session token caching.'
        },
        {
          name: 'Elasticsearch / OpenSearch',
          type: 'NoSQL',
          purpose: 'Audit trail indexing and cross-parameter search for compliance.'
        }
      ],
      authMethods: ['mTLS 1.3 for Service-to-Service', 'OAuth2 / OpenID Connect with Okta for Users', 'HMAC-SHA256 Webhook Signatures'],
      deploymentRecommendations: ['Multi-region AWS EKS Active-Active setup', 'GitOps deployment using ArgoCD', 'Automated chaos engineering testing via Gremlin']
    }
  },
  {
    id: 'proj-health-02',
    status: 'completed',
    name: 'Enterprise Medical RAG Knowledge Graph',
    clientName: 'Novartis Health Diagnostics',
    clientIndustry: 'Healthcare & Pharmaceuticals',
    aiSummary: 'An AI copilot connecting clinical trial reports, patient electronic medical records (EMR), and FDA guidelines into a vector knowledge graph to assist oncologists with precision medicine matching.',
    complexityScore: 94,
    estimatedTotalWeeks: 28,
    recommendedTechStack: ['Next.js 15', 'Python FastAPI', 'Pinecone Vector DB', 'LangChain', 'Llama 3.3 70B', 'AWS S3 Secured'],
    createdAt: '2026-02-05T11:15:00Z',
    updatedAt: '2026-03-01T09:44:00Z',
    documentsCount: 42,
    risks: [
      {
        id: 'risk-h1',
        title: 'HIPAA & PHI Data Leakage',
        impact: 'Critical',
        probability: 'Medium',
        mitigationStrategy: 'Implement automated PII/PHI scrubbing pipelines using Microsoft Presidio before indexing chunks into Vector DB.'
      },
      {
        id: 'risk-h2',
        title: 'Hallucination in Clinical Recommendations',
        impact: 'Critical',
        probability: 'High',
        mitigationStrategy: 'Enforce strict RAG citation grounding and dual-LLM verification consensus before showing recommendations to clinicians.'
      }
    ],
    requirements: [
      {
        id: 'req-h1',
        code: 'REQ-HIPAA-01',
        title: 'Automated PHI De-Identification',
        description: 'All patient names, social security numbers, and specific dates must be redacted prior to embedding generation.',
        category: 'Constraints',
        priority: 'P0',
        status: 'Verified',
        estimatedComplexity: 'High',
        citations: [
          {
            documentId: 'doc-201',
            documentName: 'Novartis_HIPAA_SOP_2026.pdf',
            pageNumber: 12,
            sectionTitle: '2.4 Safe Harbor Redaction',
            originalText: 'System must remove all 18 identifiers specified by the Privacy Rule before any data leaves the secure enclave.',
            confidenceScore: 0.99
          }
        ],
        dependencies: []
      },
      {
        id: 'req-h2',
        code: 'REQ-RAG-02',
        title: 'Sub-second Hybrid Vector Search',
        description: 'Query execution combining BM25 keyword matching and dense cosine similarity must return top 5 relevant trials under 800ms.',
        category: 'Functional',
        priority: 'P0',
        status: 'In Progress',
        estimatedComplexity: 'Medium',
        citations: [
          {
            documentId: 'doc-202',
            documentName: 'Clinical_Copilot_PRD.docx',
            pageNumber: 8,
            sectionTitle: 'Latency & UX Targets',
            originalText: 'Oncologists during patient consultations require immediate document retrieval. Maximum permitted latency is 800 milliseconds.',
            confidenceScore: 0.95
          }
        ],
        dependencies: ['REQ-HIPAA-01']
      },
      {
        id: 'req-h3',
        code: 'REQ-EMR-03',
        title: 'FHIR v4 Epic / Cerner EHR Integration',
        description: 'Bi-directional SMART on FHIR OAuth app enabling single-sign-on directly from Epic Hyperspace patient chart view.',
        category: 'Integrations',
        priority: 'P1',
        status: 'Pending AI Review',
        estimatedComplexity: 'Extreme',
        citations: [
          {
            documentId: 'doc-203',
            documentName: 'Epic_App_Orchard_Integration_Spec.pdf',
            pageNumber: 22,
            sectionTitle: 'SMART Launch Sequence',
            originalText: 'The web application must listen for the launch token parameter and query the FHIR Patient endpoint using Bearer auth.',
            confidenceScore: 0.97
          }
        ],
        dependencies: []
      }
    ],
    timeline: [
      {
        id: 'ms-h1',
        phase: 'Phase 1: Compliance Enclave & PHI Scrubbing',
        title: 'Secure Cloud Architecture & Presidio Setup',
        deliverables: ['AWS HIPAA Enclave setup', 'Presidio custom entity recognizer', 'S3 KMS customer managed keys'],
        estimatedDurationWeeks: 8,
        startDate: '2026-03-01',
        endDate: '2026-04-28',
        status: 'In Progress',
        assigneeRole: 'Security & DevOps',
        dependencies: []
      },
      {
        id: 'ms-h2',
        phase: 'Phase 2: RAG Pipeline & Vector DB',
        title: 'Pinecone Indexing & Hybrid Search Engine',
        deliverables: ['LangChain ingestion workers', 'Pinecone serverless index', 'Evaluation suite using Ragas'],
        estimatedDurationWeeks: 8,
        startDate: '2026-05-01',
        endDate: '2026-06-25',
        status: 'Not Started',
        assigneeRole: 'AI Engineering Team',
        dependencies: ['ms-h1']
      },
      {
        id: 'ms-h3',
        phase: 'Phase 3: Clinical UX & FHIR App',
        title: 'Next.js Copilot UI & Epic Integration',
        deliverables: ['SMART on FHIR Auth flow', 'Citations drawer interface', 'Oncologist pilot feedback loop'],
        estimatedDurationWeeks: 12,
        startDate: '2026-07-01',
        endDate: '2026-09-25',
        status: 'Not Started',
        assigneeRole: 'Fullstack App Team',
        dependencies: ['ms-h2']
      }
    ],
    apiEndpoints: [
      {
        id: 'ep-h1',
        method: 'POST',
        path: '/api/v1/search/trials',
        summary: 'Hybrid RAG search for clinical trials',
        description: 'Queries clinical trial embeddings combined with patient diagnostic parameters.',
        authRequired: true,
        requestPayloadExample: JSON.stringify({
          query: "Stage IV NSCLC with EGFR exon 19 deletion progression after Osimertinib",
          patientAge: 62,
          biomarkers: ["EGFR+", "PD-L1 45%"],
          topK: 5
        }, null, 2),
        responsePayloadExample: JSON.stringify({
          queryId: "Q-991203",
          results: [
            {
              nctId: "NCT05912830",
              title: "Phase III Trial of Amivantamab plus Chemotherapy in EGFR-Mutated NSCLC",
              similarityScore: 0.942,
              summary: "Eligibility criteria matches patient progression history. Trial open at Memorial Sloan Kettering.",
              evidenceQuotes: ["Patients with exon 19 del who progressed on 3rd gen TKI are eligible."]
            }
          ]
        }, null, 2)
      }
    ],
    architecture: {
      suggestedServices: [
        {
          name: 'FastAPI AI Engine',
          type: 'Backend Microservice',
          description: 'Orchestrates embeddings, prompt formatting, and Llama 3 calls.',
          tech: ['Python 3.11', 'FastAPI', 'LangChain', 'LlamaIndex']
        },
        {
          name: 'PHI Scrubbing Service',
          type: 'Data Pipeline',
          description: 'Intercepts all document uploads and redacts PII before disk storage.',
          tech: ['Python', 'Microsoft Presidio', 'Spacy']
        },
        {
          name: 'SMART on FHIR Client Portal',
          type: 'Frontend',
          description: 'Web UI embedded inside hospital EMR workstations.',
          tech: ['Next.js', 'React', 'Tailwind', 'Shadcn']
        }
      ],
      databases: [
        {
          name: 'Pinecone Serverless',
          type: 'Vector',
          purpose: 'High-dimensional embeddings for dense medical document retrieval.'
        },
        {
          name: 'PostgreSQL RDS',
          type: 'Relational',
          purpose: 'User audit logs, saved trial folders, and clinician annotations.'
        }
      ],
      authMethods: ['SMART on FHIR OAuth2', 'Hospital Active Directory SAML 2.0'],
      deploymentRecommendations: ['AWS GovCloud / Dedicated HIPAA compliant VPC', 'Strict IAM roles with no public internet egress for data stores']
    }
  },
  {
    id: 'proj-logistics-03',
    status: 'completed',
    name: 'Global Supply Chain IoT & Fleet AI Orchestrator',
    clientName: 'Maersk Logistics AI Lab',
    clientIndustry: 'Maritime & Global Logistics',
    aiSummary: 'Real-time telemetry ingestion from 50,000+ refrigerated shipping containers IoT sensors to predict supply chain bottlenecks, optimize harbor crane unloading schedules, and dynamically reroute vessels around severe weather.',
    complexityScore: 82,
    estimatedTotalWeeks: 30,
    recommendedTechStack: ['Next.js 15', 'Rust', 'Apache Flink', 'TimescaleDB', 'GraphQL', 'AWS IoT Core'],
    createdAt: '2026-01-20T14:00:00Z',
    updatedAt: '2026-03-02T16:10:00Z',
    documentsCount: 29,
    risks: [
      {
        id: 'risk-l1',
        title: 'Intermittent Satellite Connectivity on Vessels',
        impact: 'Medium',
        probability: 'High',
        mitigationStrategy: 'Edge gateways on vessels cache telemetry locally and batch upload via MQTT QoS 1 when Starlink connection stabilizes.'
      }
    ],
    requirements: [
      {
        id: 'req-l1',
        code: 'REQ-IOT-01',
        title: '100k msg/sec Telemetry Ingestion Pipeline',
        description: 'Ingest temperature, GPS coordinates, and humidity from IoT sensors every 30 seconds.',
        category: 'Functional',
        priority: 'P0',
        status: 'Verified',
        estimatedComplexity: 'High',
        citations: [
          {
            documentId: 'doc-301',
            documentName: 'Vessel_IoT_Spec_2026.pdf',
            pageNumber: 15,
            sectionTitle: '4.1 Throughput Requirements',
            originalText: 'System must sustain peak ingestion of 100,000 packets per second without message loss during vessel docked batch offloads.',
            confidenceScore: 0.98
          }
        ],
        dependencies: []
      },
      {
        id: 'req-l2',
        code: 'REQ-AI-02',
        title: 'Weather Routing Optimization Engine',
        description: 'Continuously evaluate NOAA cyclone forecasts to recommend fuel-saving course alterations.',
        category: 'Functional',
        priority: 'P1',
        status: 'In Progress',
        estimatedComplexity: 'Extreme',
        citations: [
          {
            documentId: 'doc-302',
            documentName: 'AI_Routing_Scope.docx',
            pageNumber: 4,
            sectionTitle: '2.1 Predictive Rerouting',
            originalText: 'If wave height exceeds 4.5 meters along route, AI model must compute alternative waypoints within 5 minutes.',
            confidenceScore: 0.92
          }
        ],
        dependencies: ['REQ-IOT-01']
      }
    ],
    timeline: [
      {
        id: 'ms-l1',
        phase: 'Phase 1: Edge & Ingestion Architecture',
        title: 'AWS IoT Setup & Flink Streaming Engine',
        deliverables: ['MQTT Broker configuration', 'Flink cluster deployment', 'TimescaleDB schema setup'],
        estimatedDurationWeeks: 10,
        startDate: '2026-02-01',
        endDate: '2026-04-15',
        status: 'In Progress',
        assigneeRole: 'IoT & Data Engineering',
        dependencies: []
      },
      {
        id: 'ms-l2',
        phase: 'Phase 2: Predictive Models & Fleet UI',
        title: 'Routing AI & Dispatch Control Center',
        deliverables: ['Weather prediction neural net', 'Interactive 3D WebGL Globe View', 'Automated Captain alert dispatch'],
        estimatedDurationWeeks: 14,
        startDate: '2026-04-20',
        endDate: '2026-07-30',
        status: 'Not Started',
        assigneeRole: 'AI & Frontend Engineering',
        dependencies: ['ms-l1']
      }
    ],
    apiEndpoints: [
      {
        id: 'ep-l1',
        method: 'GET',
        path: '/v2/containers/{containerId}/telemetry',
        summary: 'Get container live telemetry stream',
        description: 'Returns historical and real-time sensor readings for refrigerated containers.',
        authRequired: true,
        responsePayloadExample: JSON.stringify({
          containerId: "MSK-991203",
          timestamp: "2026-03-15T14:30:00Z",
          latitude: 34.0522,
          longitude: -118.2437,
          temperatureCelsius: -18.4,
          humidityPercentage: 42,
          powerStatus: "STABLE",
          alarms: []
        }, null, 2)
      }
    ],
    architecture: {
      suggestedServices: [
        {
          name: 'IoT Ingestion Worker',
          type: 'Data Pipeline',
          description: 'Apache Flink streaming jobs performing deduplication and anomaly detection.',
          tech: ['Java', 'Apache Flink', 'Kafka']
        },
        {
          name: 'Fleet Dispatch API',
          type: 'Backend Microservice',
          description: 'GraphQL service serving vessel tracking maps and predictive ETAs.',
          tech: ['Rust', 'Actix-web', 'GraphQL']
        }
      ],
      databases: [
        {
          name: 'TimescaleDB Cluster',
          type: 'Relational',
          purpose: 'High-performance time-series database for multi-year sensor telemetry.'
        }
      ],
      authMethods: ['X.509 Client Certificates for IoT Devices', 'SAML 2.0 Corporate SSO for Logistics Coordinators'],
      deploymentRecommendations: ['Hybrid edge deployment on vessel servers and AWS Cloud']
    }
  }
];

export const MOCK_USER: AuthUser = {
  id: 'usr-99812',
  name: 'Alex Vance',
  email: 'alex.vance@nexusai.enterprise',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'Lead Architect',
  organization: 'NexusAI Global Labs'
};
