import React from 'react';
import RestaurantDescription from '../components/RestaurantDescription/RestaurantDescription';
import Menu from '../components/Menu/Menu';

function Home() {
  return (
    <main className="main-content">
      <RestaurantDescription />
      <Menu />
    </main>
  );
}

export default Home;