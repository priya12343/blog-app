import React from 'react';
import AuthButtons from './authButton';

const Header = () => {
    return (
        <>
            <header className="tw-flex tw-flex-wrap tw-justify-around tw-items-center tw-h-12">
                <div className='tw-flex tw-justify-center lg:tw-w-[85%]'>
                    <h1>My Blog page</h1>
                </div>
                <AuthButtons />
            </header>
        </>
    )
}

export default Header;