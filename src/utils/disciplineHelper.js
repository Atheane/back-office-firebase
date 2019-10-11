  
export const setColor = (key) => {
    switch (key) {
      case 'chi':
        return '#975bff';
        break;
      case 'eng':
        return '#ea5197';
        break;
      case 'frc':
        return '#e83f4a';
        break;
      case 'geo':
        return '#b9d640';
        break;
      case 'hst':
        return '#d09566';
        break;
      case 'mth':
        return '#665eff';
        break;
      case 'phy':
        return '#82cff5';
        break;
      case 'svt':
        return '#00a65c';
        break;
      default:
        return '#665eff';
    }
  };

  export const setColorFromDisc = (key) => {
    switch (key) {
      case 'Chimie':
        return '#975bff';
        break;
      case 'English':
        return '#ea5197';
        break;
      case 'French':
        return '#e83f4a';
        break;
      case 'Geography':
        return '#b9d640';
        break;
      case 'History':
        return '#d09566';
        break;
      case 'Mathematics':
        return '#665eff';
        break;
      case 'Physics':
        return '#82cff5';
        break;
      case 'Biology':
        return '#00a65c';
        break;
      default:
        return '#665eff';
    }
  };

  export const setIcon = (key) => {
    switch (key) {
      case 'chi':
        return 'icon_chimie';
        break;
      case 'eng':
        return 'icon_anglais';
        break;
      case 'frc':
        return 'icon_francais';
        break;
      case 'geo':
        return 'icon_geographie';
        break;
      case 'hst':
        return 'icon_histoire';
        break;
      case 'mth':
        return 'icon_maths';
        break;
      case 'phy':
        return 'icon_physique';
        break;
      case 'svt':
        return 'icon_svt';
        break;
      default:
        return 'icon_maths';
    }
  }

  export const setOrder = (key) => {
    switch (key) {
      case 'chi':
        return 2;
        break;
      case 'eng':
        return 7;
        break;
      case 'frc':
        return 6;
        break;
      case 'geo':
        return 4;
        break;
      case 'hst':
        return 5;
        break;
      case 'mth':
        return 0;
        break;
      case 'phy':
        return 1;
        break;
      case 'svt':
        return 3;
        break;
      default:
        return 'icon_maths';
    }
  }

  export const setTitle = (key) => {
    switch (key) {
      case 'chi':
        return 'Chimie';
        break;
      case 'eng':
        return 'Anglais';
        break;
      case 'frc':
        return 'Francais';
        break;
      case 'geo':
        return 'Geographie';
        break;
      case 'hst':
        return 'Histoire';
        break;
      case 'mth':
        return 'Mathematiques';
        break;
      case 'phy':
        return 'Physique';
        break;
      case 'svt':
        return 'Biologie';
        break;
      default:
        return 'Mathematique';
    }
  }