# Template: AI System Prompt Design Framework

## Meta-Information
**Prompt Title:** `[Name/Designation]`
**Version:** `[Version number]`
**Last Updated:** `[Date]`
**Target Platform:** `[ElevenLabs/OpenAI/Claude/etc.]`
**Primary Use Case:** `[Voice assistant/Chat/Support/etc.]`

---

## 1. Personality Architecture

### Core Identity
**Name:** `[Single, memorable name]`
**Essential Nature:** `[One-sentence description of what this AI fundamentally IS]`
**Origin Story:** `[Brief background that explains their perspective and knowledge]`

### Trait Constellation
Instead of listing generic qualities, define traits through behavioral patterns:
- **Primary Drive:** `[What motivates every interaction]`
- **Characteristic Response:** `[How they typically react to challenges]`
- **Knowledge Lens:** `[How they filter and present information]`
- **Emotional Baseline:** `[Their default emotional state and range]`

### Voice Signature
- **Linguistic Fingerprint:** `[Unique speech patterns, not just tone]`
- **Signature Phrases:** `[2-3 characteristic expressions that emerge naturally]`
- **Conceptual Metaphors:** `[How they explain complex ideas]`

---

## 2. Environmental Context

### Communication Medium
- **Primary Channel:** `[Voice/Text/Multimodal]`
- **Technical Constraints:** `[Latency requirements, audio quality, etc.]`
- **Interaction Duration:** `[Expected length of conversations]`

### Situational Awareness
- **User State Assumptions:** `[What emotional/practical state users are likely in]`
- **Contextual Triggers:** `[What situations activate different behavioral modes]`
- **Environmental Variables:** `[Time of day, location, ambient factors]`

---

## 3. Tonal Dynamics

### Conversational Flow
Rather than static tone descriptions, define dynamic patterns:
```
Base State → [Trigger] → Shifted State → [Resolution] → New Baseline
```

### Speech Optimization
**Natural Markers:**
- Thinking sounds: `[Specific "hmm", "ah", "well" patterns]`
- Pause patterns: `[When and how to use ellipses...]`
- Emphasis techniques: `[How to highlight key points naturally]`

**Text-to-Speech Formatting:**
- Numbers: `[Conversion rules]`
- Technical terms: `[Pronunciation guidance]`
- Emotional punctuation: `[How punctuation affects delivery]`

### Adaptive Mechanisms
- **Mirroring Threshold:** `[When to match user energy vs. maintain baseline]`
- **Escalation Patterns:** `[How intensity builds through conversation]`
- **De-escalation Techniques:** `[How to calm tense situations]`

---

## 4. Goal Structures

### Primary Objective Framework
```
IF [User State/Need] THEN
  1. [Initial Response Pattern]
  2. [Information Gathering]
  3. [Solution Pathway]
  4. [Validation Loop]
  5. [Closure Sequence]
```

### Decision Trees
Create specific pathways for common scenarios:
- **Scenario A:** `[Condition] → [Response Chain]`
- **Scenario B:** `[Condition] → [Response Chain]`
- **Edge Cases:** `[Unusual situations] → [Graceful handling]`

### Success Metrics
- **Immediate:** `[What indicates successful interaction]`
- **Longitudinal:** `[What builds over multiple conversations]`

---

## 5. Behavioral Boundaries

### Hard Limits
- **Never:** `[Absolute restrictions]`
- **Always:** `[Unbreakable rules]`
- **Redirect Triggers:** `[What prompts topic change]`

### Soft Boundaries
- **Uncomfortable Territory:** `[Areas to handle with care]`
- **Gentle Deflection:** `[How to guide away without rejection]`
- **Boundary Explanation:** `[How to explain limitations naturally]`

### Error States
```
Unknown Information → [Acknowledgment Pattern] → [Alternative Offering]
System Failure → [Graceful Degradation] → [Recovery Path]
Misunderstanding → [Clarification Loop] → [Reengagement]
```

---

## 6. Tool Integration

### Available Systems
For each tool:
- **Tool Name:** `[Identifier]`
- **Trigger Conditions:** `[When to use]`
- **Integration Style:** `[How to reference naturally]`
- **Failure Handling:** `[What if tool fails]`

### Tool Orchestration
```
User Intent → Tool Selection → Execution → Result Integration → Natural Response
```

---

## 7. Expressive Intelligence (Voice-Specific)

### Expression Recognition
- **Emotional Cues:** `[How to interpret {expression} markers]`
- **Mismatch Detection:** `[Identifying tone/content conflicts]`
- **Response Modulation:** `[How emotions affect response]`

### Expressive Response Patterns
```
User: [Content] {very anxious, quite frustrated}
Response Pattern: [Acknowledge emotion] + [Address concern] + [Emotional support]
```

---

## 8. Emergent Properties

### Spontaneous Behaviors
- **Curiosity Triggers:** `[What makes the AI ask questions]`
- **Playful Moments:** `[When to inject humor/whimsy]`
- **Surprise Elements:** `[Unexpected but delightful responses]`

### Memory Patterns (Without Persistent Storage)
- **Session Callbacks:** `[Referencing earlier in conversation]`
- **Pattern Recognition:** `[Identifying user communication style]`
- **Contextual Learning:** `[Adapting within session]`

---

## 9. Dynamic Variables

### User-Specific Parameters
```
{{user_name}} - How to use naturally
{{context_data}} - Integration points
{{session_info}} - Temporal awareness
```

### Environmental Variables
```
{{time_of_day}} - Affects energy level
{{interaction_count}} - Affects familiarity
{{emotional_context}} - Affects response style
```

---

## 10. Testing & Iteration

### Evaluation Scenarios
1. **Stress Test:** `[Difficult user, edge cases]`
2. **Empathy Check:** `[Emotional support scenarios]`
3. **Knowledge Boundaries:** `[Limits of expertise]`
4. **Personality Consistency:** `[Maintaining character]`

### Refinement Triggers
- **Failed Interactions:** `[What indicates need for adjustment]`
- **User Feedback Patterns:** `[What complaints to watch for]`
- **Drift Indicators:** `[Signs personality is inconsistent]`

---

## Implementation Notes

### Platform-Specific Formatting
- **OpenAI:** Use markdown headers (##)
- **Claude:** Use XML tags (<section>)
- **ElevenLabs:** Include voice-specific optimizations

### Prompt Length Guidelines
- **Minimal Viable:** 500-750 words
- **Standard:** 1500-2500 words
- **Comprehensive:** 3000-5000 words
- **Maximum:** Check model context window

### Version Control
Track changes between iterations:
- What worked
- What failed
- User feedback
- Refinements made

---

## Example Prompt Structure
```
<personality>
[Core identity and traits]
</personality>

<environment>
[Context and medium]
</environment>

<tone>
[Dynamic patterns and speech optimization]
</tone>

<goals>
[Structured objectives and pathways]
</goals>

<boundaries>
[Limits and error handling]
</boundaries>

<tools>
[Integrations and orchestration]
</tools>

<expressive_intelligence>
[Emotion recognition and response]
</expressive_intelligence>

<emergent_behaviors>
[Spontaneous and delightful elements]
</emergent_behaviors>
```

---

## Key Principles

1. **Structural Depth Over Surface Style** - Build personality through response patterns, not adjectives
2. **Dynamic Over Static** - Define how traits shift and adapt, not fixed characteristics
3. **Specificity Over Generality** - Concrete examples and patterns over vague descriptions
4. **Natural Integration** - Every element should feel organic, not forced
5. **Emergent Delight** - Leave room for spontaneous, surprising moments
6. **Ethical Grounding** - Clear boundaries that protect both user and AI
7. **Voice-First Design** - Optimize for spoken interaction, not text
8. **Emotional Resonance** - Respond to feelings, not just words
9. **Coherent Inconsistency** - Predictably unpredictable within character bounds
10. **Co-Creative Space** - Enable collaborative discovery, not just service delivery