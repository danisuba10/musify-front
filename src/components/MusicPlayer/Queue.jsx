import React, { createContext, useState, useContext, useEffect } from "react";

const QueueContext = createContext(null);

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue must be used within a QueueProvider");
  }
  return context;
};

export const QueueProvider = ({ children }) => {
  const [queueState, setQueueState] = useState({
    queue: [],
    currentIndex: 0,
  });

  const add = (songId) => {
    setQueueState((prevState) => {
      const newQueue = [...prevState.queue, songId];
      return { ...prevState, queue: newQueue };
    });
  };

  const remove = () => {
    setQueueState((prevState) => {
      if (prevState.queue.length > 0) {
        const newQueue = prevState.queue.slice(1);
        const newIndex =
          prevState.currentIndex > 0 ? prevState.currentIndex - 1 : 0;
        return { ...prevState, queue: newQueue, currentIndex: newIndex };
      }
      return prevState;
    });
  };

  const clear = () => {
    setQueueState({ queue: [], currentIndex: 0 });
  };

  const next = () => {
    setQueueState((prevState) => {
      if (prevState.currentIndex < prevState.queue.length - 1) {
        return { ...prevState, currentIndex: prevState.currentIndex + 1 };
      }
      return prevState;
    });
  };

  const previous = () => {
    setQueueState((prevState) => {
      if (prevState.currentIndex > 0) {
        return { ...prevState, currentIndex: prevState.currentIndex - 1 };
      }
      return prevState;
    });
  };

  const skipTo = (index) => {
    setQueueState((prevState) => {
      if (index >= 0 && index < prevState.queue.length) {
        return { ...prevState, currentIndex: index };
      }
      return prevState;
    });
  };

  const playNow = (songId) => {
    setQueueState((prevState) => {
      const newQueue = [...prevState.queue, songId];
      return {
        ...prevState,
        queue: newQueue,
        currentIndex: newQueue.length - 1,
      };
    });
  };

  const playNext = (songId) => {
    setQueueState((prevState) => {
      const newQueue = [...prevState.queue];
      newQueue.splice(prevState.currentIndex + 1, 0, songId);
      return { ...prevState, queue: newQueue };
    });
  };

  const hasNext = () => {
    return queueState.currentIndex < queueState.queue.length - 1;
  };

  const hasPrevious = () => {
    return queueState.currentIndex > 0;
  };

  const current = queueState.queue[queueState.currentIndex];

  const index = queueState.currentIndex;

  const length = queueState.queue.length;

  return (
    <QueueContext.Provider
      value={{
        queue: queueState.queue,
        current,
        index,
        length,
        add,
        remove,
        clear,
        next,
        previous,
        skipTo,
        playNow,
        playNext,
        hasNext,
        hasPrevious,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export default QueueProvider;
