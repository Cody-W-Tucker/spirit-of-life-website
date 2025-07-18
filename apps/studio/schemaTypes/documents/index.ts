import { author } from "./author";
import { blog } from "./blog";
import { blogIndex } from "./blog-index";
import { event } from "./event";
import { eventIndex } from "./event-index";
import { faq } from "./faq";
import { footer } from "./footer";
import { homePage } from "./home-page";
import { navbar } from "./navbar";
import { page } from "./page";
import { settings } from "./settings";

export const singletons = [homePage, blogIndex, eventIndex, settings, footer, navbar];

export const documents = [blog, page, faq, author, event, ...singletons];
