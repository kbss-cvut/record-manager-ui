## Form generation

Record Manager uses form templates to generate forms for data entry. Each form template defines the structure
and fields of a form, as well as interactions between fields (e.g., visibility conditions, calculations, etc.).
When a form is generated, it is created based on a selected form template.

The following diagram illustrates typical process (implemented in
[form-generation-sms.ttl](../deploy/shared/s-pipes-engine/scripts/form-generation.sms.ttl)) of form generation
in two scenarios:

1. When a new record is opened (i.e., a form is created from a template).
2. When an existing record is opened (i.e., a form is created from a template and populated with existing record data).

```mermaid
sequenceDiagram
autonumber
    participant RecordManager as "Record Manager"
    participant RecordManagerServer as "Record Manager Server"
    participant SPipesEngine as "SPipes Engine"
    participant DBServer as "DB Server"

    alt open new record

        RecordManager->>RecordManagerServer: create form (templateId)
        RecordManagerServer-->>SPipesEngine: create from (templateId)
        SPipesEngine-->>DBServer: get form template (templateId)
        DBServer-->>SPipesEngine: return form template
        SPipesEngine-->>SPipesEngine: clone form from the template
        note right of SPipesEngine: Fresh Ids are generated for all questions from the template
        SPipesEngine-->>RecordManagerServer: return form
        note right of RecordManagerServer: The form is returned in JSON-LD format
        RecordManagerServer-->>RecordManager: return form

    else open existing record

        RecordManager->>RecordManagerServer: create form (recordId)
        RecordManagerServer-->>SPipesEngine: create from (recordId)
        SPipesEngine-->>DBServer: get record data (recordId)
        DBServer-->>SPipesEngine: return record data
        SPipesEngine-->>SPipesEngine: extract templateId from record data
        SPipesEngine-->>DBServer: get form template(templateId)
        DBServer-->>SPipesEngine: return form template
        SPipesEngine-->>SPipesEngine: clone form
        SPipesEngine-->>SPipesEngine: attach record data to the form
        SPipesEngine-->>RecordManagerServer: return form
        RecordManagerServer-->>RecordManager: return form

    end
```
