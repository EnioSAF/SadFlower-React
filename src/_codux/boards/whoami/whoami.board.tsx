import React from 'react';
import { createBoard } from '@wixc3/react-board';
import Whoami from '../../../../components/system32/windows/whoami';

import '../../../styles/system32/windows/window.sass'

export default createBoard({
    name: 'Whoami',
    Board: () => <Whoami />,
    isSnippet: true,
});
