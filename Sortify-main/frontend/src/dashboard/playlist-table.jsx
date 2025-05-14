import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./playlist-table.css";
import newPlaylist from "../../../Resources/newPlaylist.png";
import Popup from "../playlistcreation/Popup";
import { useState } from "react";

const PlaylistTable = ({ playlists }) => {
  const [openPopup, setOpenPopup] = useState(false);

  PlaylistTable.propTypes = {
    playlists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
      })
    ).isRequired,
  };

  const cardsPerRow = 5;
  const navigate = useNavigate();

  const handleCreateNewPlaylistClick = () => {
    navigate("/createplaylist");
  };

  return (
    <Container style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
      <Row className="g-3">
        <Col
          md={12 / cardsPerRow}
          className="create-new-playlist-card custom-col"
          onClick={() => {
            handleCreateNewPlaylistClick();
          }}
          style={{ cursor: "pointer" }}
        >
          <Card className="card-hover-effect">
            <Card.Img
              variant="top"
              src={newPlaylist}
              alt="Create New Playlist"
            />
            <Card.Body>
              <Card.Text
                className="card-text"
                style={{ fontSize: "1rem", fontWeight: "400" }}
              >
                Create New
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {playlists.map((playlist, index) => (
          <Col
            key={index}
            md={12 / cardsPerRow}
            className={`playlist-card ${
              index === 0 ? "first-playlist-card" : ""
            }`}
            onClick={() => {
              setOpenPopup(true);
            }}
            style={{ cursor: "pointer" }}
          >
            <Card className="card-hover-effect">
              <Card.Img
                variant="top"
                src={playlist.imageUrl}
                alt={playlist.name}
              />
              <Card.Body>
                <Card.Title
                  className="card-title"
                  style={{ fontSize: "1rem", fontWeight: "400" }}
                >
                  {playlist.name}
                </Card.Title>
                <Card.Text
                  className="card-text"
                  style={{ fontSize: "1rem", fontWeight: "400" }}
                >
                  {playlist.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} />
    </Container>
  );
};

export default PlaylistTable;
