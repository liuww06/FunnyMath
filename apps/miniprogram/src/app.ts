import { ComponentProps } from '@tarojs/taro';
import './app.scss';

class App extends ComponentProps {
  onLaunch() {
    console.log('FunnyMath Mini Program launched');
  }

  onShow() {
    console.log('FunnyMath Mini Program shown');
  }

  onHide() {
    console.log('FunnyMath Mini Program hidden');
  }
}

export default App;
