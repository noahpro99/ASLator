import React from 'react';
import { Link } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

function Footer() {
    return (
        <div className='bg-maroon p-4 flex flex-col justify-center items-center'>
            <section className='max-w-full w-full'>
                <div className='flex justify-between items-center w-9/10 max-w-[1000px] mx-auto my-2'>
                    <small className='text-light-gold mb-2'>ASLTranslator © 2023</small>
                    <div className='flex justify-between items-center w-[240px]'>
                        <Link className='text-light-gold text-2xl' to='/' target='_blank' aria-label='Facebook'>
                            <i className='fa fa-facebook' />
                        </Link>
                        <Link className='text-light-gold text-2xl' to='/' target='_blank' aria-label='Instagram'>
                            <i className='fa fa-instagram' />
                        </Link>
                        <Link className='text-light-gold text-2xl' to='/' target='_blank' aria-label='Youtube'>
                            <i className='fa fa-youtube' />
                        </Link>
                        <Link className='text-light-gold text-2xl' to='/service' target='_blank' aria-label='Twitter'>
                            <i className='fa fa-twitter' />
                        </Link>
                        <Link className='text-light-gold text-2xl' to='/service' target='_blank' aria-label='LinkedIn'>
                            <i className='fa fa-linkedin' />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Footer;
