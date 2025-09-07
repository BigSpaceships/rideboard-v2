import { defineStore } from 'pinia';
import { PopupType, type Car, type Event } from '@/models';
import { usePopupStore } from './popup';

function sortByStartDate(a: Event, b: Event) {
  return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
}

export const useEventStore = defineStore('events', {
  state: () => ({
    events: [] as Event[],
    id: null as number | null,
    isLoaded: false,
    isHistory: false
  }),
  getters: {
    selectedEvent(state) {
      return state.events.find((event) => {
        return event.id == state.id;
      });
    },
    selectedEventCars(): Car[] | undefined {
      return this.selectedEvent?.cars;
    }
  },
  actions: {
    async loadEvents(showPast: boolean) {
      const popupStore = usePopupStore();
      try {
        const response = await fetch(
          '/api/v1/event/?' +
            new URLSearchParams({
              past: showPast.toString()
            }).toString()
        );
        if (!response.ok) {
          popupStore.addPopup(PopupType.Danger, `Failed to Get Events (${response.status})`);
          return;
        }
        const data = await response.json();
        const eventStore = useEventStore();
        eventStore.setEvents(data, showPast);
        eventStore.sortEvents(showPast);

        return true;
      } catch (error) {
        console.error(error);
        popupStore.addPopup(PopupType.Danger, 'Failed to Get Events. An unknown error occured.');

        return false;
      }
    },
    addEvent(event: Event) {
      this.events.push(event);
    },
    setEvents(events: Event[], isHistory: boolean) {
      this.events = events;

      this.isHistory = isHistory;
      this.isLoaded = true;
    },
    setEventId(id: number) {
      this.id = id;
    },
    sortEvents(past: Boolean) {
      this.events.sort(sortByStartDate);

      if (past) {
        this.events.reverse();
      }
    },
    removeEvent(id: number | null) {
      if (id == null) {
        return;
      }
      const index = this.events.findIndex((event) => event.id == id);
      if (index > -1) {
        this.events.splice(index, 1);
      }
    },
    addCar(car: Car) {
      this.selectedEvent?.cars?.push(car);
    },
    removeCar(car: Car) {
      const index = this.selectedEvent?.cars?.indexOf(car);
      if (index != null && index > -1) {
        this.selectedEvent?.cars?.splice(index, 1);
      }
    }
  }
});
