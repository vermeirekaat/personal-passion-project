import React, { useState, useEffect } from "react";

import shortBeep from "./../audio/short.mp3";
import longBeep from "./../audio/long.mp3";

    const useMultiAudio = () => {
        const array = ["long", "short", "long", "long"];

        const getUrls = () => {
            const urls =[];
            array.forEach((item) => {
                if (item === "short") {
                    urls.push(shortBeep);
                } else {
                    urls.push(longBeep);
                }
            }); 
            return urls;
        };

        const urls = getUrls();
        const [sources] = useState(
          urls.map(url => {
            return {
              url,
              audio: new Audio(url)
            };
          })
        );
      
        const [players, setPlayers] = useState(
          urls.map(url => {
            return {
              url,
              playing: false
            };
          })
        );
      
        const toggle = targetIndex => () => {
          const newPlayers = [...players];
          const currentIndex = players.findIndex(p => p.playing === true);
          if (currentIndex !== -1 && currentIndex !== targetIndex) {
            newPlayers[currentIndex].playing = false;
            newPlayers[targetIndex].playing = true;
          } else if (currentIndex !== -1) {
            newPlayers[targetIndex].playing = false;
          } else {
            newPlayers[targetIndex].playing = true;
          }
          setPlayers(newPlayers);
        };
      
        useEffect(() => {
          sources.forEach((source, i) => {
            players[i].playing ? source.audio.play() : source.audio.pause();
          });
        }, [sources, players]);
      
        useEffect(() => {
          sources.forEach((source, i) => {
            source.audio.addEventListener("ended", () => {
              const newPlayers = [...players];
              newPlayers[i].playing = false;
              setPlayers(newPlayers);
            });
          });
          return () => {
            sources.forEach((source, i) => {
              source.audio.removeEventListener("ended", () => {
                const newPlayers = [...players];
                newPlayers[i].playing = false;
                setPlayers(newPlayers);
              });
            });
          };
        }, []);
      
        return [players, toggle];
      };
      
      const MultiPlayer = () => {
        const [players, toggle] = useMultiAudio();
      
        return (
          <div>
            {players.map((player, i) => (
              <Player key={i} player={player} toggle={toggle(i)} />
            ))}
          </div>
        );
      };
      
      const Player = ({ player, toggle }) => (
        <div>
          <p style={{color: "white"}}>Stream URL: {player.url}</p>
          <button onClick={toggle}>{player.playing ? "Pause" : "Play"}</button>
        </div>
      );
      
      export default MultiPlayer;