"""
Database Seed Script
Populates the database with realistic sample travel data for GlobeTrotter.
"""

import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Ensure UTF-8 output encoding on Windows if supported
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from datetime import date, time
from decimal import Decimal
from app.database import get_db_session
from app.models import (
    User,
    City,
    Activity,
    Trip,
    TripStop,
    ItineraryItem,
    Expense,
    Memory,
)


def seed_database(clear_first: bool = False) -> None:
    """
    Seed realistic sample data into the database.
    
    :param clear_first: If True, clears existing records before inserting.
    """
    with get_db_session() as db:
        if clear_first:
            print("[*] Clearing existing data...")
            db.query(Memory).delete()
            db.query(Expense).delete()
            db.query(ItineraryItem).delete()
            db.query(TripStop).delete()
            db.query(Activity).delete()
            db.query(Trip).delete()
            db.query(City).delete()
            db.query(User).delete()
            db.flush()
            print("[OK] Existing data cleared.")

        print("[*] Seeding GlobeTrotter database...")

        # -------------------------------------------------------------
        # 1. SEED USERS
        # -------------------------------------------------------------
        user_himanshu = User(
            name="Himanshu Patel",
            email="himanshu@globetrotter.app",
            password_hash="$2b$12$e8k6m3zV1XQv0Kq9YwQfAe1lZJzD8wH4gB2iY9vA1cK3eQ4tZ0nMe",  # 'password123'
        )
        user_saumya = User(
            name="Saumya Bavaliya",
            email="saumya@globetrotter.app",
            password_hash="$2b$12$e8k6m3zV1XQv0Kq9YwQfAe1lZJzD8wH4gB2iY9vA1cK3eQ4tZ0nMe",  # 'password123'
        )
        user_aarav = User(
            name="Aarav Sharma",
            email="aarav.sharma@traveler.in",
            password_hash="$2b$12$e8k6m3zV1XQv0Kq9YwQfAe1lZJzD8wH4gB2iY9vA1cK3eQ4tZ0nMe",  # 'password123'
        )

        db.add_all([user_himanshu, user_saumya, user_aarav])
        db.flush()
        print(f"[OK] Seeded 3 Users")

        # -------------------------------------------------------------
        # 2. SEED CITIES (12 Indian Cities)
        # -------------------------------------------------------------
        city_ahmedabad = City(
            name="Ahmedabad",
            country="India",
            region="Gujarat",
            latitude=Decimal("23.0225"),
            longitude=Decimal("72.5714"),
            description="India's first UNESCO World Heritage City, famous for Pol architecture, Sabarmati Riverfront, and rich textile culture.",
            cost_index=2,
            popularity=4.5,
            best_time_to_visit="Oct - Mar",
            image_url="https://images.unsplash.com/photo-1599831104321-7397b973e20e?w=800&auto=format&fit=crop&q=80",
        )
        city_mumbai = City(
            name="Mumbai",
            country="India",
            region="Maharashtra",
            latitude=Decimal("18.9220"),
            longitude=Decimal("72.8347"),
            description="The bustling City of Dreams, featuring colonial architecture, Bollywood, Arabian Sea promenades, and vibrant street food.",
            cost_index=4,
            popularity=4.9,
            best_time_to_visit="Nov - Feb",
            image_url="https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80",
        )
        city_goa = City(
            name="Goa",
            country="India",
            region="Goa",
            latitude=Decimal("15.2993"),
            longitude=Decimal("74.1240"),
            description="Sun-kissed beaches, Portuguese heritage churches, lively shacks, water sports, and tranquil backwaters.",
            cost_index=3,
            popularity=4.9,
            best_time_to_visit="Oct - Apr",
            image_url="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
        )
        city_delhi = City(
            name="Delhi",
            country="India",
            region="Delhi NCR",
            latitude=Decimal("28.6139"),
            longitude=Decimal("77.2090"),
            description="The historic capital featuring Mughal monuments, vibrant bazaars of Chandni Chowk, and world-class food.",
            cost_index=3,
            popularity=4.8,
            best_time_to_visit="Oct - Mar",
            image_url="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80",
        )
        city_jaipur = City(
            name="Jaipur",
            country="India",
            region="Rajasthan",
            latitude=Decimal("26.9124"),
            longitude=Decimal("75.7873"),
            description="The Pink City of royalty, magnificent forts, Amber Palace, Hawa Mahal, and handcrafted textiles.",
            cost_index=2,
            popularity=4.8,
            best_time_to_visit="Oct - Mar",
            image_url="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80",
        )
        city_udaipur = City(
            name="Udaipur",
            country="India",
            region="Rajasthan",
            latitude=Decimal("24.5854"),
            longitude=Decimal("73.7125"),
            description="The romantic City of Lakes, featuring scenic Lake Pichola, white marble palaces, and sunset boat cruises.",
            cost_index=3,
            popularity=4.7,
            best_time_to_visit="Sep - Mar",
            image_url="https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&auto=format&fit=crop&q=80",
        )
        city_manali = City(
            name="Manali",
            country="India",
            region="Himachal Pradesh",
            latitude=Decimal("32.2396"),
            longitude=Decimal("77.1887"),
            description="High-altitude Himalayan paradise offering snow-capped peaks, pine forests, Rohtang Pass, and adventure sports.",
            cost_index=3,
            popularity=4.7,
            best_time_to_visit="Apr - Jun, Dec - Feb",
            image_url="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
        )
        city_varanasi = City(
            name="Varanasi",
            country="India",
            region="Uttar Pradesh",
            latitude=Decimal("25.3176"),
            longitude=Decimal("82.9739"),
            description="The spiritual heart of India along the sacred River Ganges, known for Ghats, evening Ganga Aarti, and ancient temples.",
            cost_index=1,
            popularity=4.6,
            best_time_to_visit="Oct - Mar",
            image_url="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80",
        )
        city_bengaluru = City(
            name="Bengaluru",
            country="India",
            region="Karnataka",
            latitude=Decimal("12.9716"),
            longitude=Decimal("77.5946"),
            description="India's Silicon Valley and Garden City, celebrated for craft microbreweries, lush Cubbon Park, and pleasant climate.",
            cost_index=3,
            popularity=4.5,
            best_time_to_visit="Sep - Mar",
            image_url="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80",
        )
        city_kochi = City(
            name="Kochi",
            country="India",
            region="Kerala",
            latitude=Decimal("9.9312"),
            longitude=Decimal("76.2673"),
            description="Historic coastal port city featuring Chinese fishing nets, colonial spice markets, and serene backwater waterways.",
            cost_index=2,
            popularity=4.6,
            best_time_to_visit="Oct - Mar",
            image_url="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80",
        )
        city_agra = City(
            name="Agra",
            country="India",
            region="Uttar Pradesh",
            latitude=Decimal("27.1767"),
            longitude=Decimal("78.0081"),
            description="Home to the majestic Taj Mahal, Agra Fort, and UNESCO monuments from the golden Mughal era.",
            cost_index=2,
            popularity=4.9,
            best_time_to_visit="Oct - Mar",
            image_url="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80",
        )
        city_srinagar = City(
            name="Srinagar",
            country="India",
            region="Jammu and Kashmir",
            latitude=Decimal("34.0837"),
            longitude=Decimal("74.7973"),
            description="Venice of the East with picturesque Dal Lake, wooden Shikara houseboats, and Mughal terrace gardens.",
            cost_index=3,
            popularity=4.8,
            best_time_to_visit="Apr - Oct",
            image_url="https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80",
        )

        all_cities = [
            city_ahmedabad, city_mumbai, city_goa, city_delhi,
            city_jaipur, city_udaipur, city_manali, city_varanasi,
            city_bengaluru, city_kochi, city_agra, city_srinagar,
        ]
        db.add_all(all_cities)
        db.flush()
        print(f"[OK] Seeded {len(all_cities)} Cities")

        # -------------------------------------------------------------
        # 3. SEED ACTIVITIES (26 Activities Across Cities)
        # -------------------------------------------------------------
        activities = [
            # Ahmedabad
            Activity(
                city_id=city_ahmedabad.id,
                name="Sabarmati Ashram Heritage Walk",
                description="Explore Mahatma Gandhi's humble residence and the museum chronicling the Indian freedom struggle.",
                category="culture",
                duration_minutes=90,
                estimated_cost=Decimal("0.0"),
                rating=4.8,
                latitude=Decimal("23.0605"),
                longitude=Decimal("72.5804"),
                image_url="https://images.unsplash.com/photo-1599831104321-7397b973e20e?w=800&auto=format&fit=crop&q=80",
            ),
            Activity(
                city_id=city_ahmedabad.id,
                name="Manek Chowk Street Food Trail",
                description="Experience late-night culinary street delights: Gwalior Dosa, Pav Bhaji, and Kulfi.",
                category="food",
                duration_minutes=120,
                estimated_cost=Decimal("450.0"),
                rating=4.7,
                latitude=Decimal("23.0232"),
                longitude=Decimal("72.5898"),
            ),
            Activity(
                city_id=city_ahmedabad.id,
                name="Adalaj Stepwell Architectural Tour",
                description="Admire the intricate 5-story subterranean Solanki carvings at this 15th-century stepwell.",
                category="sightseeing",
                duration_minutes=60,
                estimated_cost=Decimal("50.0"),
                rating=4.6,
                latitude=Decimal("23.1667"),
                longitude=Decimal("72.5803"),
            ),
            # Mumbai
            Activity(
                city_id=city_mumbai.id,
                name="Gateway of India & Colaba Causeway",
                description="Visit the iconic seaside arch monument followed by street shopping along heritage Colaba.",
                category="sightseeing",
                duration_minutes=150,
                estimated_cost=Decimal("200.0"),
                rating=4.8,
                latitude=Decimal("18.9220"),
                longitude=Decimal("72.8347"),
                image_url="https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80",
            ),
            Activity(
                city_id=city_mumbai.id,
                name="Marine Drive Sunset Walk",
                description="Stroll the Queen's Necklace promenade as city lights reflect on the Arabian Sea.",
                category="relaxation",
                duration_minutes=90,
                estimated_cost=Decimal("0.0"),
                rating=4.9,
                latitude=Decimal("18.9438"),
                longitude=Decimal("72.8232"),
            ),
            Activity(
                city_id=city_mumbai.id,
                name="Elephanta Caves Ferry & Exploration",
                description="Ferry ride to UNESCO rock-cut cave temples dedicated to Lord Shiva on Elephanta Island.",
                category="culture",
                duration_minutes=240,
                estimated_cost=Decimal("650.0"),
                rating=4.6,
                latitude=Decimal("18.9633"),
                longitude=Decimal("72.9315"),
            ),
            # Goa
            Activity(
                city_id=city_goa.id,
                name="Baga & Calangute Water Sports",
                description="Parasailing, jet ski rides, and banana boat adventures along the North Goa shoreline.",
                category="adventure",
                duration_minutes=180,
                estimated_cost=Decimal("2200.0"),
                rating=4.7,
                latitude=Decimal("15.5553"),
                longitude=Decimal("73.7517"),
                image_url="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
            ),
            Activity(
                city_id=city_goa.id,
                name="Old Goa Churches Heritage Walk",
                description="Basilica of Bom Jesus and Se Cathedral exhibiting 16th-century Portuguese Baroque architecture.",
                category="culture",
                duration_minutes=120,
                estimated_cost=Decimal("100.0"),
                rating=4.8,
                latitude=Decimal("15.5009"),
                longitude=Decimal("73.9116"),
            ),
            Activity(
                city_id=city_goa.id,
                name="Dudhsagar Waterfall Jeep Safari",
                description="Thrilling off-road jungle expedition through Bhagwan Mahavir Sanctuary to the four-tiered waterfall.",
                category="nature",
                duration_minutes=360,
                estimated_cost=Decimal("1800.0"),
                rating=4.9,
                latitude=Decimal("15.3144"),
                longitude=Decimal("74.3143"),
            ),
            # Delhi
            Activity(
                city_id=city_delhi.id,
                name="Old Delhi Heritage & Street Food Rickshaw Ride",
                description="Navigate the alleys of Chandni Chowk, Paranthe Wali Gali, and Jama Masjid on a rickshaw.",
                category="food",
                duration_minutes=180,
                estimated_cost=Decimal("800.0"),
                rating=4.8,
                latitude=Decimal("28.6507"),
                longitude=Decimal("77.2334"),
            ),
            Activity(
                city_id=city_delhi.id,
                name="Qutub Minar & Mehrauli Archaeological Park",
                description="Explore the world's tallest brick minaret and surrounding centuries-old tombs and ruins.",
                category="sightseeing",
                duration_minutes=120,
                estimated_cost=Decimal("50.0"),
                rating=4.7,
                latitude=Decimal("28.5245"),
                longitude=Decimal("77.1855"),
            ),
            # Jaipur
            Activity(
                city_id=city_jaipur.id,
                name="Amber Fort Jeep Ascent & Palace Tour",
                description="Majestic hilltop fortress overlooking Maota Lake with the famous Sheesh Mahal mirror palace.",
                category="sightseeing",
                duration_minutes=180,
                estimated_cost=Decimal("500.0"),
                rating=4.9,
                latitude=Decimal("26.9855"),
                longitude=Decimal("75.8513"),
            ),
            Activity(
                city_id=city_jaipur.id,
                name="Hawa Mahal & Johari Bazaar Walk",
                description="Photograph the 953-window Palace of Winds and shop for handcrafted gemstones and Bandhani.",
                category="photography",
                duration_minutes=120,
                estimated_cost=Decimal("250.0"),
                rating=4.7,
                latitude=Decimal("26.9239"),
                longitude=Decimal("75.8267"),
            ),
            # Udaipur
            Activity(
                city_id=city_udaipur.id,
                name="City Palace & Museum Tour",
                description="Rajasthan's largest royal palace complex with panoramic balconies over Lake Pichola.",
                category="culture",
                duration_minutes=180,
                estimated_cost=Decimal("400.0"),
                rating=4.9,
                latitude=Decimal("24.5764"),
                longitude=Decimal("73.6835"),
            ),
            Activity(
                city_id=city_udaipur.id,
                name="Lake Pichola Sunset Boat Cruise",
                description="Tranquil boat journey past Jag Mandir and Lake Palace during golden sunset hours.",
                category="relaxation",
                duration_minutes=75,
                estimated_cost=Decimal("600.0"),
                rating=4.8,
                latitude=Decimal("24.5750"),
                longitude=Decimal("73.6780"),
            ),
            # Manali
            Activity(
                city_id=city_manali.id,
                name="Solang Valley Paragliding & Zorbing",
                description="Soar high above green mountain meadows with tandem paragliding instructors.",
                category="adventure",
                duration_minutes=180,
                estimated_cost=Decimal("3200.0"),
                rating=4.8,
                latitude=Decimal("32.3160"),
                longitude=Decimal("77.1580"),
            ),
            Activity(
                city_id=city_manali.id,
                name="Hadimba Temple Cedar Forest Walk",
                description="Tranquil 16th-century pagoda temple surrounded by towering ancient Himalayan cedar groves.",
                category="nature",
                duration_minutes=90,
                estimated_cost=Decimal("50.0"),
                rating=4.7,
                latitude=Decimal("32.2483"),
                longitude=Decimal("77.1802"),
            ),
            # Varanasi
            Activity(
                city_id=city_varanasi.id,
                name="Dawn Boat Ride along Varanasi Ghats",
                description="Early morning rowboat ride to witness sunrise rituals at Assi, Dashashwamedh, and Manikarnika Ghats.",
                category="culture",
                duration_minutes=120,
                estimated_cost=Decimal("500.0"),
                rating=4.9,
                latitude=Decimal("25.3076"),
                longitude=Decimal("83.0107"),
            ),
            Activity(
                city_id=city_varanasi.id,
                name="Grand Ganga Aarti Experience",
                description="Mesmerizing evening devotional ceremony of brass lamps, chants, and incense at Dashashwamedh Ghat.",
                category="culture",
                duration_minutes=90,
                estimated_cost=Decimal("0.0"),
                rating=5.0,
                latitude=Decimal("25.3072"),
                longitude=Decimal("83.0105"),
            ),
            # Bengaluru
            Activity(
                city_id=city_bengaluru.id,
                name="Cubbon Park & Bangalore Palace",
                description="Morning nature walk through 300-acre green lungs followed by Tudor-style royal palace exploration.",
                category="nature",
                duration_minutes=180,
                estimated_cost=Decimal("450.0"),
                rating=4.6,
                latitude=Decimal("12.9763"),
                longitude=Decimal("77.5929"),
            ),
            Activity(
                city_id=city_bengaluru.id,
                name="Indiranagar Microbrewery & Pub Hopping",
                description="Sample local artisanal beers, IPA flights, and sourdough pizzas along 100ft Road.",
                category="nightlife",
                duration_minutes=180,
                estimated_cost=Decimal("1800.0"),
                rating=4.7,
                latitude=Decimal("12.9784"),
                longitude=Decimal("77.6408"),
            ),
            # Kochi
            Activity(
                city_id=city_kochi.id,
                name="Fort Kochi Chinese Fishing Nets & Jew Town",
                description="Watch historic cantilevered fishing nets in action, followed by antique shopping in Jew Town.",
                category="culture",
                duration_minutes=150,
                estimated_cost=Decimal("100.0"),
                rating=4.7,
                latitude=Decimal("9.9656"),
                longitude=Decimal("76.2423"),
            ),
            Activity(
                city_id=city_kochi.id,
                name="Kerala Kathakali Classical Dance Performance",
                description="Witness elaborate face makeup and vibrant mythological theatrical performance.",
                category="culture",
                duration_minutes=120,
                estimated_cost=Decimal("500.0"),
                rating=4.8,
                latitude=Decimal("9.9660"),
                longitude=Decimal("76.2415"),
            ),
            # Agra
            Activity(
                city_id=city_agra.id,
                name="Taj Mahal Sunrise Experience",
                description="Experience the ivory-white marble wonder at dawn with changing pink and golden hues.",
                category="sightseeing",
                duration_minutes=180,
                estimated_cost=Decimal("250.0"),
                rating=5.0,
                latitude=Decimal("27.1751"),
                longitude=Decimal("78.0421"),
            ),
            # Srinagar
            Activity(
                city_id=city_srinagar.id,
                name="Dal Lake Shikara Ride & Floating Market",
                description="Serene morning cruise through lotus blossoms, water canals, and floating vegetable markets.",
                category="relaxation",
                duration_minutes=120,
                estimated_cost=Decimal("800.0"),
                rating=4.9,
                latitude=Decimal("34.0837"),
                longitude=Decimal("74.8373"),
            ),
        ]
        db.add_all(activities)
        db.flush()
        print(f"[OK] Seeded {len(activities)} Activities")

        # -------------------------------------------------------------
        # 4. SEED TRIPS (3 Sample Trips)
        # -------------------------------------------------------------
        trip1 = Trip(
            user_id=user_himanshu.id,
            name="Monsoon Escape: West Coast Trail",
            description="A scenic coastal road and rail journey starting from the heritage streets of Ahmedabad down to Mumbai's energetic promenades and Goa's serene beaches.",
            start_date=date(2026, 9, 10),
            end_date=date(2026, 9, 16),
            budget=Decimal("35000.00"),
            currency="INR",
            status="upcoming",
            cover_image="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80",
        )

        trip2 = Trip(
            user_id=user_himanshu.id,
            name="Royal Rajasthan Heritage Tour",
            description="Discover the grandeur of maharajas, desert palaces, hilltop forts, and tranquil lake cruises across Delhi, Jaipur, and Udaipur.",
            start_date=date(2026, 11, 5),
            end_date=date(2026, 11, 12),
            budget=Decimal("48000.00"),
            currency="INR",
            status="draft",
            cover_image="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=80",
        )

        trip3 = Trip(
            user_id=user_saumya.id,
            name="Himalayan Adventure & High Passes",
            description="Alpine escapade into the heart of Himachal Pradesh, featuring valley treks, pine forests, and high-adrenaline paragliding.",
            start_date=date(2026, 7, 15),
            end_date=date(2026, 7, 20),
            budget=Decimal("28000.00"),
            currency="INR",
            status="completed",
            cover_image="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&auto=format&fit=crop&q=80",
        )

        db.add_all([trip1, trip2, trip3])
        db.flush()
        print("[OK] Seeded 3 Trips")

        # -------------------------------------------------------------
        # 5. SEED TRIP STOPS
        # -------------------------------------------------------------
        # Trip 1 Stops: Ahmedabad -> Mumbai -> Goa
        stop1_1 = TripStop(
            trip_id=trip1.id,
            city_id=city_ahmedabad.id,
            arrival_date=date(2026, 9, 10),
            departure_date=date(2026, 9, 11),
            stop_order=1,
        )
        stop1_2 = TripStop(
            trip_id=trip1.id,
            city_id=city_mumbai.id,
            arrival_date=date(2026, 9, 12),
            departure_date=date(2026, 9, 13),
            stop_order=2,
        )
        stop1_3 = TripStop(
            trip_id=trip1.id,
            city_id=city_goa.id,
            arrival_date=date(2026, 9, 14),
            departure_date=date(2026, 9, 16),
            stop_order=3,
        )

        # Trip 2 Stops: Delhi -> Jaipur -> Udaipur
        stop2_1 = TripStop(
            trip_id=trip2.id,
            city_id=city_delhi.id,
            arrival_date=date(2026, 11, 5),
            departure_date=date(2026, 11, 7),
            stop_order=1,
        )
        stop2_2 = TripStop(
            trip_id=trip2.id,
            city_id=city_jaipur.id,
            arrival_date=date(2026, 11, 7),
            departure_date=date(2026, 11, 9),
            stop_order=2,
        )
        stop2_3 = TripStop(
            trip_id=trip2.id,
            city_id=city_udaipur.id,
            arrival_date=date(2026, 11, 9),
            departure_date=date(2026, 11, 12),
            stop_order=3,
        )

        # Trip 3 Stops: Delhi -> Manali
        stop3_1 = TripStop(
            trip_id=trip3.id,
            city_id=city_delhi.id,
            arrival_date=date(2026, 7, 15),
            departure_date=date(2026, 7, 16),
            stop_order=1,
        )
        stop3_2 = TripStop(
            trip_id=trip3.id,
            city_id=city_manali.id,
            arrival_date=date(2026, 7, 17),
            departure_date=date(2026, 7, 20),
            stop_order=2,
        )

        trip_stops = [stop1_1, stop1_2, stop1_3, stop2_1, stop2_2, stop2_3, stop3_1, stop3_2]
        db.add_all(trip_stops)
        db.flush()
        print(f"[OK] Seeded {len(trip_stops)} Trip Stops")

        # -------------------------------------------------------------
        # 6. SEED ITINERARY ITEMS
        # -------------------------------------------------------------
        itinerary_items = [
            # Trip 1 - Day 1 (Ahmedabad)
            ItineraryItem(
                trip_id=trip1.id,
                activity_id=activities[0].id,  # Sabarmati Ashram
                trip_stop_id=stop1_1.id,
                title="Morning Walk at Sabarmati Ashram",
                description="Explore Gandhi Ashram and peaceful riverfront reflections.",
                date=date(2026, 9, 10),
                start_time=time(9, 0),
                end_time=time(10, 30),
                item_type="activity",
                item_order=1,
                estimated_cost=Decimal("0.0"),
            ),
            ItineraryItem(
                trip_id=trip1.id,
                activity_id=None,
                trip_stop_id=stop1_1.id,
                title="Traditional Gujarati Thali Lunch",
                description="Authentic Gujarati feast at Agashiye heritage terrace.",
                date=date(2026, 9, 10),
                start_time=time(13, 0),
                end_time=time(14, 30),
                item_type="meal",
                item_order=2,
                estimated_cost=Decimal("850.0"),
            ),
            ItineraryItem(
                trip_id=trip1.id,
                activity_id=activities[1].id,  # Manek Chowk
                trip_stop_id=stop1_1.id,
                title="Night Food Trail at Manek Chowk",
                description="Late-night street food feast.",
                date=date(2026, 9, 10),
                start_time=time(21, 30),
                end_time=time(23, 0),
                item_type="meal",
                item_order=3,
                estimated_cost=Decimal("450.0"),
            ),
            # Trip 1 - Day 2 (Vande Bharat to Mumbai)
            ItineraryItem(
                trip_id=trip1.id,
                activity_id=None,
                trip_stop_id=stop1_2.id,
                title="Vande Bharat Express: Ahmedabad to Mumbai",
                description="Scenic high-speed train journey through Western Ghats foothills.",
                date=date(2026, 9, 11),
                start_time=time(6, 10),
                end_time=time(11, 35),
                item_type="travel",
                item_order=1,
                estimated_cost=Decimal("1650.0"),
            ),
            ItineraryItem(
                trip_id=trip1.id,
                activity_id=activities[3].id,  # Gateway of India
                trip_stop_id=stop1_2.id,
                title="Gateway of India & Colaba Sightseeing",
                description="Marvel at the colonial arch and seaside views.",
                date=date(2026, 9, 12),
                start_time=time(15, 0),
                end_time=time(17, 30),
                item_type="activity",
                item_order=2,
                estimated_cost=Decimal("200.0"),
            ),
            ItineraryItem(
                trip_id=trip1.id,
                activity_id=activities[4].id,  # Marine Drive
                trip_stop_id=stop1_2.id,
                title="Sunset Stroll along Marine Drive",
                description="Enjoy the Arabian Sea breeze along the Queen's Necklace.",
                date=date(2026, 9, 12),
                start_time=time(18, 0),
                end_time=time(19, 30),
                item_type="activity",
                item_order=3,
                estimated_cost=Decimal("0.0"),
            ),
            # Trip 1 - Day 4 (Goa)
            ItineraryItem(
                trip_id=trip1.id,
                activity_id=activities[6].id,  # Goa Water Sports
                trip_stop_id=stop1_3.id,
                title="Baga Beach Water Sports Adventures",
                description="Parasailing and jet ski rides over turquoise waters.",
                date=date(2026, 9, 14),
                start_time=time(10, 0),
                end_time=time(13, 0),
                item_type="activity",
                item_order=1,
                estimated_cost=Decimal("2200.0"),
            ),
            ItineraryItem(
                trip_id=trip1.id,
                activity_id=None,
                trip_stop_id=stop1_3.id,
                title="Sunset Beachside Shack Dinner",
                description="Fresh Goan seafood curry and poi bread by the ocean.",
                date=date(2026, 9, 14),
                start_time=time(19, 30),
                end_time=time(22, 0),
                item_type="meal",
                item_order=2,
                estimated_cost=Decimal("1200.0"),
            ),
            ItineraryItem(
                trip_id=trip1.id,
                activity_id=activities[8].id,  # Dudhsagar
                trip_stop_id=stop1_3.id,
                title="Dudhsagar Waterfall Jeep Safari",
                description="Day expedition to the towering white water falls.",
                date=date(2026, 9, 15),
                start_time=time(8, 0),
                end_time=time(15, 0),
                item_type="activity",
                item_order=1,
                estimated_cost=Decimal("1800.0"),
            ),
        ]
        db.add_all(itinerary_items)
        db.flush()
        print(f"[OK] Seeded {len(itinerary_items)} Itinerary Items")

        # -------------------------------------------------------------
        # 7. SEED EXPENSES
        # -------------------------------------------------------------
        expenses = [
            # Trip 1 Expenses
            Expense(
                trip_id=trip1.id,
                category="transportation",
                description="Vande Bharat Train Ticket (Ahmedabad to Mumbai)",
                amount=Decimal("1650.00"),
                currency="INR",
                expense_date=date(2026, 9, 11),
            ),
            Expense(
                trip_id=trip1.id,
                category="accommodation",
                description="Heritage Boutique Hotel Mumbai (2 Nights)",
                amount=Decimal("7800.00"),
                currency="INR",
                expense_date=date(2026, 9, 11),
            ),
            Expense(
                trip_id=trip1.id,
                category="transportation",
                description="Flight Ticket (Mumbai to Goa)",
                amount=Decimal("3400.00"),
                currency="INR",
                expense_date=date(2026, 9, 13),
            ),
            Expense(
                trip_id=trip1.id,
                category="accommodation",
                description="Beachfront Resort North Goa (3 Nights)",
                amount=Decimal("9600.00"),
                currency="INR",
                expense_date=date(2026, 9, 14),
            ),
            Expense(
                trip_id=trip1.id,
                category="activities",
                description="Water Sports Combo Package (Baga)",
                amount=Decimal("2200.00"),
                currency="INR",
                expense_date=date(2026, 9, 14),
            ),
            Expense(
                trip_id=trip1.id,
                category="food",
                description="Seafood Beach Shack Dinner",
                amount=Decimal("1250.00"),
                currency="INR",
                expense_date=date(2026, 9, 14),
            ),
            Expense(
                trip_id=trip1.id,
                category="shopping",
                description="Anjuna Flea Market Souvenirs & Spices",
                amount=Decimal("1500.00"),
                currency="INR",
                expense_date=date(2026, 9, 15),
            ),
            # Trip 3 Expenses
            Expense(
                trip_id=trip3.id,
                category="transportation",
                description="Volvo AC Bus Delhi to Manali",
                amount=Decimal("2800.00"),
                currency="INR",
                expense_date=date(2026, 7, 16),
            ),
            Expense(
                trip_id=trip3.id,
                category="activities",
                description="Solang Valley Paragliding Expedition",
                amount=Decimal("3200.00"),
                currency="INR",
                expense_date=date(2026, 7, 18),
            ),
        ]
        db.add_all(expenses)
        db.flush()
        print(f"[OK] Seeded {len(expenses)} Expenses")

        # -------------------------------------------------------------
        # 8. SEED MEMORIES
        # -------------------------------------------------------------
        memories = [
            Memory(
                user_id=user_himanshu.id,
                trip_id=trip1.id,
                image_url="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&auto=format&fit=crop&q=80",
                caption="Golden sunset reflections over Baga Beach with the sea breeze.",
                location="Goa, India",
                memory_date=date(2026, 9, 14),
            ),
            Memory(
                user_id=user_himanshu.id,
                trip_id=trip1.id,
                image_url="https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1000&auto=format&fit=crop&q=80",
                caption="Gateway of India during morning blue hour.",
                location="Mumbai, India",
                memory_date=date(2026, 9, 12),
            ),
            Memory(
                user_id=user_saumya.id,
                trip_id=trip3.id,
                image_url="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1000&auto=format&fit=crop&q=80",
                caption="Touching the clouds above Solang Valley meadows.",
                location="Manali, Himachal Pradesh",
                memory_date=date(2026, 7, 18),
            ),
            Memory(
                user_id=user_himanshu.id,
                trip_id=None,
                image_url="https://images.unsplash.com/photo-1599831104321-7397b973e20e?w=1000&auto=format&fit=crop&q=80",
                caption="Serene sunrise walking along the Sabarmati Riverfront.",
                location="Ahmedabad, Gujarat",
                memory_date=date(2026, 8, 20),
            ),
        ]
        db.add_all(memories)
        db.flush()
        print(f"[OK] Seeded {len(memories)} Memories")

        print("\n[SUCCESS] Database seed completed successfully!")


if __name__ == "__main__":
    seed_database(clear_first=True)
