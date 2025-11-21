import { Link, useParams } from 'react-router-dom';
import './EventPage.scss'
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchEventById, toggleEventSignup } from '../../features/events/eventsSlice';
import temp from '../../assets/temp.png'
import { formatDate, formatTime } from '../../utils/dateUtils';

const EventPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const selectedEvent = useAppSelector(state => state.events.selectedEvent);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchEventById(id));
  }, [dispatch])
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    dispatch(toggleEventSignup(id));
  };

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

      <div className='event-info'>
        <span className="event-info_label med-14">
          Дата:
        </span>
        <span className="event-info_value semibold-18">
          {selectedEvent?.time && formatDate(selectedEvent?.time)}
        </span>
        <span className="event-info_label med-14">
          Время:
        </span>
        <span className="event-info_value semibold-18">
          {selectedEvent?.time && formatTime(selectedEvent?.time)}
        </span>
        <span className="event-info_label med-14">
          Осталось мест: 
        </span>
        <span className="event-info_value semibold-18">
          {selectedEvent?.spots_left}/{selectedEvent?.spots}
        </span>
        <h2 className='semibold-16 event-info_title'>Информация о мероприятии</h2>
        <p className='reg-16 event-info_desc'>{selectedEvent?.description}</p>
        <div className='event_sign'>
          {selectedEvent && selectedEvent.user_signed_up ? (
            <div className='event-card_signed'>
              <div className='event-card_signed-info semibold-18'>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.219783 6.21967C0.512676 5.92678 0.98755 5.92678 1.28044 6.21967L4.75011 9.68934L14.2198 0.21967C14.5127 -0.073223 14.9875 -0.0732233 15.2804 0.21967C15.5733 0.512563 15.5733 0.987437 15.2804 1.28033L5.28044 11.2803C4.98755 11.5732 4.51268 11.5732 4.21978 11.2803L0.219783 7.28033C-0.07311 6.98744 -0.07311 6.51256 0.219783 6.21967Z" fill="#0D6EFD"/>
                </svg>
                <span>Вы записаны</span>
              </div>
              <button className='event-card_btn-cancel semibold-18' onClick={handleSignUp}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.219748 0.219644C0.512641 -0.0732486 0.987515 -0.0732489 1.28041 0.219644L5.99272 4.93195L10.705 0.219644C10.9979 -0.0732486 11.4728 -0.0732489 11.7657 0.219644C12.0586 0.512537 12.0586 0.987412 11.7657 1.2803L7.05338 5.99261L11.7657 10.7049C12.0586 10.9978 12.0586 11.4727 11.7657 11.7656C11.4728 12.0585 10.9979 12.0585 10.705 11.7656L5.99272 7.05327L1.28041 11.7656C0.987515 12.0585 0.512641 12.0585 0.219748 11.7656C-0.0731455 11.4727 -0.0731455 10.9978 0.219748 10.7049L4.93206 5.99261L0.219748 1.2803C-0.0731455 0.987411 -0.0731455 0.512538 0.219748 0.219644Z" fill="#D7342B"/>
                </svg>
              </button>
            </div>
          ) : (
            <button className='event-card_btn-signup semibold-18' onClick={handleSignUp}>
              Записаться
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventPage;