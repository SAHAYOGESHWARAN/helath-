type EventHandler = (payload: any) => void;

class EventBus {
  private handlers: Record<string, EventHandler[]> = {};

  publish(eventType: string, payload: any) {
    const handlers = this.handlers[eventType] || [];
    handlers.forEach(h => {
      try { h(payload); } catch (e) { console.error('event handler error', e); }
    });
  }

  subscribe(eventType: string, handler: EventHandler) {
    if (!this.handlers[eventType]) this.handlers[eventType] = [];
    this.handlers[eventType].push(handler);
    return () => {
      this.handlers[eventType] = this.handlers[eventType].filter(h => h !== handler);
    };
  }
}

export const eventBus = new EventBus();

export const EVENTS = {
  MESSAGE_CREATED: 'message.created',
  APPOINTMENT_CREATED: 'appointment.created',
  APPOINTMENT_UPDATED: 'appointment.updated',
  NOTE_CREATED: 'note.created',
  LAB_ORDER_CREATED: 'laborder.created',
  LAB_RESULT_READY: 'labresult.ready',
};

export default eventBus;
