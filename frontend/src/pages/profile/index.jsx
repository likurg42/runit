import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Link45deg } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { actions } from '../../slices/modalSlice.js';
import { fetchUserSnippets } from '../../slices/snippetsSlice.js';

import NotFoundPage from '../404';
import NewSnippetForm from './NewSnippetForm.jsx';
import SnippetCard from './SnippetCard.jsx';

function ProfileLayout({ data, isEditable }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, snippets } = data;

  const handleInDevelopment = () => {
    dispatch(actions.openModal({ type: 'inDevelopment' }));
  };

  return (
    <div className="page-bg-image">
      <Container className="py-5">
        <div className="d-flex align-items-start">
          <h1 className="display-5">{user.username}</h1>
          <Button
            className="btn-icon-only"
            onClick={handleInDevelopment}
            size="sm"
            variant="nofill-body"
          >
            <Link45deg />
            <span className="visually-hidden">{t('profileActions.share')}</span>
          </Button>
        </div>

        <Row
          as={TransitionGroup}
          className="g-4 py-3"
          lg={3}
          sm={2}
          xs={1}
          xxl={4}
        >
          {isEditable ? <NewSnippetForm /> : null}
          {snippets.map((snippet) => (
            <CSSTransition key={snippet.id} classNames="width" timeout={250}>
              <SnippetCard data={snippet} isEditable={isEditable} />
            </CSSTransition>
          ))}
        </Row>
      </Container>
    </div>
  );
}

function ProfilePage() {
  const dispatch = useDispatch();
  const { username } = useParams();
  const user = useSelector((state) => state.user.userInfo);
  const snippetsSlice = useSelector((state) => state.snippets);

  const isMyProfile = username === user.username;

  useEffect(() => {
    dispatch(fetchUserSnippets())
      .unwrap()
      .catch((serializedError) => {
        const error = new Error(serializedError.message);
        error.name = serializedError.name;
        throw error;
      });
  }, [dispatch]);

  // TODO: добавить возможность получать сниппеты другого пользователя, когда появится возможность делится профилем
  return isMyProfile ? (
    <ProfileLayout
      data={{ user, snippets: snippetsSlice.snippets }}
      isEditable={isMyProfile}
    />
  ) : (
    <NotFoundPage />
  );
}

export default ProfilePage;
