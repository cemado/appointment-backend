# Sistema de Gestión de Citas Médicas - Diagrama de Arquitectura

## 🏗️ Diagrama de Arquitectura Serverless

```mermaid
graph TB
    subgraph "Cliente"
        A[Frontend Web/Mobile] --> B[HTTP Requests]
    end

    subgraph "AWS Cloud"
        B --> C[API Gateway]
        
        subgraph "Lambda Functions"
            C --> D[Hello Handler<br/>GET /hello]
            C --> E[Create Appointment<br/>POST /appointments]
            C --> F[List Appointments<br/>GET /appointments]
            C --> G[Get Appointment<br/>GET /appointments/{id}]
            C --> H[Update Appointment<br/>PUT /appointments/{id}]
            C --> I[Delete Appointment<br/>DELETE /appointments/{id}]
            C --> J[Get Stats<br/>GET /appointments/stats]
            C --> K[Confirm Appointment<br/>PATCH /appointments/{id}/confirm]
            C --> L[Cancel Appointment<br/>PATCH /appointments/{id}/cancel]
        end
        
        subgraph "Almacenamiento"
            M[In-Memory Store<br/>(Temporal)]
            N[DynamoDB<br/>(Producción)]
        end
        
        subgraph "Observabilidad"
            O[CloudWatch Logs]
            P[CloudWatch Metrics]
        end
        
        D --> M
        E --> M
        F --> M
        G --> M
        H --> M
        I --> M
        J --> M
        K --> M
        L --> M
        
        E -.-> N
        F -.-> N
        G -.-> N
        H -.-> N
        I -.-> N
        
        E --> O
        F --> O
        G --> O
        H --> O
        I --> O
        J --> O
        K --> O
        L --> O
        
        E --> P
        F --> P
        G --> P
        H --> P
        I --> P
    end

    style A fill:#e1f5fe
    style C fill:#fff3e0
    style M fill:#f3e5f5
    style N fill:#e8f5e8
    style O fill:#fce4ec
    style P fill:#fce4ec
```

## 🔄 Diagrama de Flujo de Datos

```mermaid
sequenceDiagram
    participant C as Cliente
    participant AG as API Gateway
    participant L as Lambda Handler
    participant DB as Base de Datos
    participant CW as CloudWatch

    Note over C,CW: Flujo de Creación de Cita

    C->>AG: POST /appointments
    AG->>L: Invoke create handler
    
    L->>L: Validar datos
    alt Datos inválidos
        L->>AG: Error 400
        AG->>C: Validation Error
    else Datos válidos
        L->>DB: Verificar disponibilidad
        alt Horario ocupado
            L->>AG: Error 409
            AG->>C: Conflict Error
        else Horario disponible
            L->>DB: Crear cita
            DB->>L: Cita creada
            L->>CW: Log request
            L->>AG: Success 201
            AG->>C: Cita creada exitosamente
        end
    end
```

## 📊 Diagrama de Modelo de Datos

```mermaid
erDiagram
    APPOINTMENT {
        string id PK
        string patientName
        string patientEmail
        string patientPhone
        string doctorName
        string doctorSpecialty
        string appointmentDate
        string appointmentTime
        number duration
        string status
        string priority
        string appointmentType
        string notes
        string symptoms
        string createdAt
        string updatedAt
        string createdBy
        string updatedBy
        string roomNumber
        number cost
    }
    
    INSURANCE_INFO {
        string provider
        string policyNumber
        string coverageType
    }
    
    APPOINTMENT_STATS {
        number total
        object byStatus
        object byPriority
        object byType
        object byDoctor
        number upcomingToday
        number upcomingWeek
    }
    
    APPOINTMENT ||--o{ INSURANCE_INFO : "can have"
    APPOINTMENT ||--|| APPOINTMENT_STATS : "generates"
```

## 🔧 Diagrama de Componentes

```mermaid
graph LR
    subgraph "src/"
        subgraph "handlers/"
            A[appointments.ts<br/>- create<br/>- list<br/>- get<br/>- update<br/>- remove<br/>- stats<br/>- confirm<br/>- cancel]
            B[hello.ts<br/>- handler]
        end
        
        subgraph "types/"
            C[appointment.ts<br/>- Appointment<br/>- CreateAppointmentRequest<br/>- UpdateAppointmentRequest<br/>- AppointmentFilters<br/>- AppointmentStats]
        end
        
        subgraph "utils/"
            D[response.ts<br/>- createResponse<br/>- successResponse<br/>- errorResponse]
            E[auth.ts<br/>- logRequest<br/>- extractUser<br/>- isAuthorized]
            F[database.ts<br/>- DatabaseInterface<br/>- InMemoryDatabase]
            G[validator.ts<br/>- validateData<br/>- schemas]
        end
    end
    
    A --> C
    A --> D
    A --> E
    A --> F
    B --> D
    A --> G
    
    style A fill:#ffeb3b
    style B fill:#4caf50
    style C fill:#2196f3
    style D fill:#ff5722
    style E fill:#9c27b0
    style F fill:#607d8b
    style G fill:#ff9800
```

## ⚡ Diagrama de Estados de Cita

```mermaid
stateDiagram-v2
    [*] --> scheduled : Crear cita
    
    scheduled --> confirmed : Confirmar
    scheduled --> cancelled : Cancelar
    
    confirmed --> in_progress : Iniciar consulta
    confirmed --> cancelled : Cancelar
    confirmed --> no_show : No presentarse
    
    in_progress --> completed : Finalizar consulta
    in_progress --> cancelled : Cancelar emergencia
    
    completed --> [*]
    cancelled --> [*]
    no_show --> [*]
    
    note right of scheduled : Estado inicial
    note right of confirmed : Paciente confirma asistencia
    note right of in_progress : Consulta en curso
    note right of completed : Consulta finalizada
    note right of cancelled : Cita cancelada
    note right of no_show : Paciente no se presentó
```

## 🚀 Diagrama de Despliegue

```mermaid
graph TB
    subgraph "Desarrollo Local"
        A[VS Code] --> B[Serverless Offline]
        B --> C[http://localhost:3000]
    end
    
    subgraph "CI/CD"
        D[Git Repository] --> E[GitHub Actions<br/>/ GitLab CI]
        E --> F[Build & Test]
        F --> G[Deploy Script]
    end
    
    subgraph "AWS Production"
        G --> H[CloudFormation Stack]
        H --> I[API Gateway]
        H --> J[Lambda Functions]
        H --> K[CloudWatch]
        H --> L[IAM Roles]
    end
    
    subgraph "Monitoreo"
        M[CloudWatch Dashboards]
        N[CloudWatch Alarms]
        O[X-Ray Tracing]
    end
    
    I --> J
    J --> K
    J --> M
    J --> N
    J --> O
    
    style A fill:#e3f2fd
    style G fill:#fff3e0
    style I fill:#e8f5e8
    style J fill:#fff9c4
    style M fill:#fce4ec
```

## 📱 Diagrama de Casos de Uso

```mermaid
graph LR
    subgraph "Actores"
        A[Paciente]
        B[Personal Médico]
        C[Administrador]
    end
    
    subgraph "Casos de Uso"
        D[Crear Cita]
        E[Consultar Citas]
        F[Modificar Cita]
        G[Cancelar Cita]
        H[Confirmar Cita]
        I[Ver Estadísticas]
        J[Gestionar Agenda]
    end
    
    A --> D
    A --> E
    A --> F
    A --> G
    
    B --> E
    B --> H
    B --> I
    B --> J
    
    C --> E
    C --> F
    C --> G
    C --> I
    C --> J
    
    style A fill:#e1f5fe
    style B fill:#e8f5e8
    style C fill:#fff3e0
```

## 🔍 Diagrama de Filtros y Búsqueda

```mermaid
graph TD
    A[GET /appointments] --> B{Query Parameters}
    
    B --> C[doctorName]
    B --> D[patientEmail]
    B --> E[status]
    B --> F[appointmentDate]
    B --> G[dateFrom/dateTo]
    B --> H[priority]
    B --> I[appointmentType]
    B --> J[page/limit]
    B --> K[includeStats]
    
    C --> L[Filter by Doctor]
    D --> M[Filter by Patient]
    E --> N[Filter by Status]
    F --> O[Filter by Date]
    G --> P[Date Range Filter]
    H --> Q[Filter by Priority]
    I --> R[Filter by Type]
    J --> S[Apply Pagination]
    K --> T[Include Statistics]
    
    L --> U[Combined Results]
    M --> U
    N --> U
    O --> U
    P --> U
    Q --> U
    R --> U
    
    U --> S
    S --> V[Sort by DateTime]
    V --> W[Return Paginated Results]
    
    T --> X[Calculate Stats]
    X --> Y[Add Stats to Response]
    
    style A fill:#4caf50
    style B fill:#ff9800
    style U fill:#2196f3
    style W fill:#9c27b0
```

---

## 📝 Notas sobre la Arquitectura

### ✅ **Ventajas de la Arquitectura Serverless:**
- **Escalabilidad automática**: Se adapta a la demanda
- **Sin gestión de servidores**: AWS maneja la infraestructura
- **Costos por uso**: Solo pagas por las invocaciones
- **Alta disponibilidad**: Distribuido en múltiples AZ
- **Rápido desarrollo**: Framework Serverless facilita despliegue

### 🔄 **Para Producción se Recomienda:**
- **DynamoDB**: Base de datos NoSQL escalable
- **Autenticación**: JWT con Amazon Cognito
- **Rate Limiting**: Para prevenir abuso
- **Monitoreo**: Dashboards y alertas personalizadas
- **Tests**: Cobertura completa de pruebas
- **Cache**: ElastiCache para consultas frecuentes