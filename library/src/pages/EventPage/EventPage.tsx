import { Link, useParams } from 'react-router-dom';
import './EventPage.scss'
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchEventById } from '../../features/events/eventsSlice';
import temp from '../../assets/temp.png'

const EventPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const selectedEvent = useAppSelector(state => state.events.selectedEvent);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchEventById(id));
  }, [dispatch])

  return (
    <div className='page-event'>
      <Link to={'/events'} className='events_back'>
        <div className='verify_back-icon'>
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.57496 0.29074C5.34102 -0.0268896 4.89389 -0.0947391 4.57626 0.139194C4.32955 0.320898 4.09503 0.502641 3.89078 0.662044C3.48302 0.980262 2.93694 1.41834 2.38877 1.89429C1.84415 2.36716 1.28112 2.89146 0.84863 3.38094C0.633107 3.62486 0.434901 3.87697 0.286705 4.1228C0.150328 4.34902 2.80986e-06 4.65986 0 4.99995C2.80986e-06 5.34003 0.150328 5.6509 0.286705 5.87712C0.434901 6.12295 0.633107 6.37505 0.84863 6.61898C1.28112 7.10845 1.84415 7.63275 2.38877 8.10563C2.93694 8.58158 3.48302 9.01965 3.89078 9.33787C4.09503 9.49728 4.32955 9.67902 4.57626 9.86072C4.89389 10.0947 5.34102 10.0268 5.57496 9.70918C5.66899 9.58149 5.71426 9.43288 5.71414 9.2856V4.99995V0.714314C5.71426 0.567035 5.66899 0.418422 5.57496 0.29074Z" fill="#808990"/>
          </svg>
        </div>
        <span className='verify_back-text semibold-16'>
          Назад
        </span>
      </Link>
      <h1 className='text-h1'>{selectedEvent?.title}</h1>
      <div className='event-imgs'>
        <div className='event-img'>
          <img src={temp} alt="" />
        </div>
      </div>

      
    </div>
  )
}

export default EventPage;