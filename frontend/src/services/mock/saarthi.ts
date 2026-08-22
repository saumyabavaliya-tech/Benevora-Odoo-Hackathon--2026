import { ChatMessage, MoodType, Trip, ItineraryItem } from '../../types';
import { mockCities, mockActivities } from '../../data/mockData';
import { delay } from '../../lib/utils';

export const saarthiService = {
  async sendMessage(
    userMessage: string,
    options?: { mood?: MoodType; tripContext?: Partial<Trip> }
  ): Promise<ChatMessage> {
    return this.generateResponse(userMessage, options?.mood, options?.tripContext);
  },

  async generateResponse(
    userMessage: string,
    currentMood?: MoodType,
    tripContext?: Partial<Trip>
  ): Promise<ChatMessage> {
    await delay(700); // Simulate AI generation delay

    const lower = userMessage.toLowerCase();

    // 1. Specific demo prompts
    if (lower.includes('ahmedabad') || lower.includes('5 day') || lower.includes('5-day') || lower.includes('west coast')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'saarthi',
        content: `I’ve mapped out a stunning **5-day West Coast Odyssey: Ahmedabad → Mumbai → Goa**! 🌅

- **Days 1–2 (Ahmedabad)**: Historic UNESCO Pols heritage walk, sunset cycling at Sabarmati Riverfront, and midnight street-food feast at Manek Chowk.
- **Day 3 (Mumbai)**: High-speed Vande Bharat scenic rail transit, Gateway of India, Kala Ghoda art walk, and Marine Drive evening breeze.
- **Days 4–5 (Goa)**: Latin quarter Fontainhas photography trail, Dudhsagar jungle safari, and an acoustic sunset catamaran cruise.

Would you like me to push this directly into your trip itinerary or adjust travel pace?`,
        timestamp: 'Just now',
        suggestedActions: [
          'Apply this route to my trip',
          'Optimize for photography & food',
          'Keep it strictly under ₹30,000',
        ],
        recommendations: {
          cities: mockCities.filter((c) => ['Ahmedabad', 'Mumbai', 'Goa'].includes(c.name)),
          tripPlanSummary: {
            title: '5-Day Coastal Odyssey',
            route: ['Ahmedabad', 'Mumbai', 'Goa'],
            duration: '5 Days / 4 Nights',
            estimatedBudget: '₹28,500',
            highlights: ['Vande Bharat Rail', 'Adalaj Stepwell', 'Marine Drive Sunset', 'Catamaran Cruise'],
          },
        },
      };
    }

    if (lower.includes('budget') || lower.includes('30,000') || lower.includes('30000') || lower.includes('reduce') || lower.includes('cheap')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'saarthi',
        content: `💡 **Budget Optimization Plan (Target: ₹30,000 max)**:

1. **Transit Optimization**: Swap morning flights for the Executive Vande Bharat Express (Ahmedabad to Mumbai) — saves **₹4,200**.
2. **Stay Strategy**: Choose boutique heritage homestays in Ahmedabad & Fontainhas Goa instead of 5-star chain resorts — saves **₹6,000**.
3. **Dining**: Balance fine-dining with authentic culinary trails (Agashiye thali + Manek Chowk night eats + Goa beach shacks).
4. **Estimated Total**: **₹26,800** (giving you a safe **₹3,200 buffer** for shopping!).`,
        timestamp: 'Just now',
        suggestedActions: [
          'Update trip budget to ₹30,000',
          'Show budget breakdown chart',
          'Suggest free activities in Goa',
        ],
      };
    }

    if (lower.includes('adventure') || currentMood === 'Adventurous') {
      return {
        id: `msg-${Date.now()}`,
        sender: 'saarthi',
        content: `⚡ **High-Adrenaline Adventure Suggestions**:

- **Goa**: Off-road 4x4 Jeep Safari through Bhagwan Mahaveer Sanctuary to Dudhsagar Waterfalls + Scuba diving near Grande Island.
- **Mumbai**: Sailing expedition on an Olympic-class J24 boat from Mumbai Harbour.
- **Ahmedabad**: Night cycling expedition across the riverfront and ancient walled-city gates.

I've added these thrill-seekers highlights to your recommended cards!`,
        timestamp: 'Just now',
        suggestedActions: [
          'Add Dudhsagar Safari to Day 5',
          'Find water sports in Goa',
          'Make it more relaxing',
        ],
        recommendations: {
          activities: mockActivities.filter((a) => a.category === 'Adventure' || a.category === 'Nature'),
        },
      };
    }

    if (lower.includes('romantic') || currentMood === 'Romantic') {
      return {
        id: `msg-${Date.now()}`,
        sender: 'saarthi',
        content: `❤️ **Curated Romantic Escapes**:

- Private sunset sailing charter over Mandovi Bay with sparkling cider and acoustic music.
- Candlelit rooftop dinner overlooking the illuminated Queen’s Necklace in South Mumbai.
- Early morning private shikara boat on Lake Pichola in Udaipur with heritage palace views.

Shall we weave these into golden-hour slots in your schedule?`,
        timestamp: 'Just now',
        suggestedActions: [
          'Add sunset sailing to Day 4',
          'Find secluded beaches',
          'Suggest luxury heritage stays',
        ],
      };
    }

    if (lower.includes('food') || lower.includes('eat') || currentMood === 'Foodie') {
      return {
        id: `msg-${Date.now()}`,
        sender: 'saarthi',
        content: `🍲 **Epicurean Foodie Trail**:

- **Ahmedabad**: Midnight chocolate-cheese toast and fresh kulfi at Manek Chowk, authentic Dal Baati and steamed Khaman Dhokla.
- **Mumbai**: Irani Cafe bun muska & chai at Kyani & Co, followed by Mahesh Lunch Home butter-garlic seafood.
- **Goa**: Fresh sea-bass recheado, poi bread, and coconut feni cocktails at a beachfront shack in Vagator.`,
        timestamp: 'Just now',
        suggestedActions: [
          'Add Food Crawl to Itinerary',
          'Show vegetarian options',
          'Suggest top rated cafes',
        ],
        recommendations: {
          activities: mockActivities.filter((a) => a.category === 'Food'),
        },
      };
    }

    // Default intelligent response
    return {
      id: `msg-${Date.now()}`,
      sender: 'saarthi',
      content: `I've analyzed your travel preferences ${currentMood ? `for **${currentMood}** vibe` : ''}. 

Here are customized recommendations tailored for you:
- Optimize your route to minimize transit fatigue.
- Pick top-rated local activities with verified photography spots.
- Keep your budget balanced with real-time expense tracking.

Try asking me: *"Plan a 5-day trip from Ahmedabad"*, *"Reduce my trip budget"*, or *"Find hidden gems in Goa"*!`,
      timestamp: 'Just now',
      suggestedActions: [
        'Plan a 5-day trip from Ahmedabad',
        'Find hidden gems',
        'Suggest scenic sunset spots',
      ],
    };
  },

  generateSmartItinerary(trip: Partial<Trip>): ItineraryItem[] {
    const dest = trip.destinations || ['Ahmedabad', 'Mumbai', 'Goa'];
    const items: ItineraryItem[] = [];

    let day = 1;
    dest.forEach((cityName) => {
      // Arrival / check-in
      items.push({
        id: `itin-gen-${day}-1`,
        dayNumber: day,
        date: trip.startDate || '2026-09-10',
        time: '09:00 AM',
        title: `Welcome & Check-in at ${cityName}`,
        type: 'accommodation',
        cityName: cityName,
        locationName: `${cityName} City Center`,
        estimatedCost: 3200,
        currency: trip.currency || '₹',
      });

      // City activity
      const cityAct = mockActivities.find((a) => a.cityName.toLowerCase() === cityName.toLowerCase());
      if (cityAct) {
        items.push({
          id: `itin-gen-${day}-2`,
          dayNumber: day,
          date: trip.startDate || '2026-09-10',
          time: '02:00 PM',
          title: cityAct.name,
          type: 'activity',
          cityName: cityName,
          locationName: cityAct.locationName,
          estimatedCost: cityAct.estimatedCost,
          currency: trip.currency || '₹',
          imageUrl: cityAct.imageUrl,
          activityId: cityAct.id,
        });
      }

      // Evening leisure
      items.push({
        id: `itin-gen-${day}-3`,
        dayNumber: day,
        date: trip.startDate || '2026-09-10',
        time: '07:30 PM',
        title: `${cityName} Culinary Trail & Night Market`,
        type: 'meal',
        cityName: cityName,
        locationName: `${cityName} Heritage District`,
        estimatedCost: 750,
        currency: trip.currency || '₹',
      });

      day++;
    });

    return items;
  },
};
