import LuggageIcon from '@mui/icons-material/Luggage';
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import useAnimatedNavToggler from "./helpers/useAnimatedNavToggler.js";
import { ReactComponent as MenuIcon } from "feather-icons/dist/icons/menu.svg";
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import * as hst from './Styles/HeaderStyles.js';


function Header({ logoLink, links, className, collapseBreakpointClass = "lg" }) {
    const defaultLinks = [
        <hst.NavLinks key={1}>
          <hst.NavLink href="/trips">Trips</hst.NavLink>
          <hst.NavLink href="/logout">Logout</hst.NavLink>
        </hst.NavLinks>
      ];
    
      const { showNavLinks, animation, toggleNavbar } = useAnimatedNavToggler();
      const collapseBreakpointCss = hst.collapseBreakPointCssMap[collapseBreakpointClass];
    
      const defaultLogoLink = (
        <hst.LogoLink href="/">
          <LuggageIcon />
          The Trip Planner
        </hst.LogoLink>
      );
    
      logoLink = logoLink || defaultLogoLink;
      links = links || defaultLinks;

    return (
        <hst.Header className={className || "header-light"}>
            <hst.DesktopNavLinks css={collapseBreakpointCss.desktopNavLinks}>
                {logoLink}
                {links}
            </hst.DesktopNavLinks>

            <hst.MobileNavLinksContainer css={collapseBreakpointCss.mobileNavLinksContainer}>
                {logoLink}
                <hst.MobileNavLinks initial={{ x: "150%", display: "none" }} animate={animation} css={collapseBreakpointCss.mobileNavLinks}>
                    {links}
                </hst.MobileNavLinks>
                <hst.NavToggle onClick={toggleNavbar} className={showNavLinks ? "open" : "closed"}>
                    {showNavLinks ? <CloseIcon tw="w-6 h-6" /> : <MenuIcon tw="w-6 h-6" />}
                </hst.NavToggle>
            </hst.MobileNavLinksContainer>
        </hst.Header>
    );

};

export default Header;