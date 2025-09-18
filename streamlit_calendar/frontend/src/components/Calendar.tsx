import "../styles/Calendar.css"

import {
    CalendarOptions,
    EventApi,
    EventSourceInput,
    ViewApi,
} from "@fullcalendar/core"
import FullCalendar from "@fullcalendar/react"

import dayGridPlugin from "@fullcalendar/daygrid"
import multiMonthPlugin from "@fullcalendar/multimonth"

import ptBrLocale from '@fullcalendar/core/locales/pt-br';


import React, { useRef } from "react"
import { Streamlit, withStreamlitConnection } from "streamlit-component-lib"
import { ComponentProps } from "streamlit-component-lib/dist/StreamlitReact"
import styled from "styled-components"
import {
  Callback
} from "../types/Calendar.type"

const ENABLED_PLUGINS = [
  dayGridPlugin,
  multiMonthPlugin,
]

const FullCalendarWrapper = styled.div<{ $customCSS?: string }>`
  ${(props) => props.$customCSS}
`

type Props = ComponentProps<{
  events?: EventSourceInput
  options?: CalendarOptions
  custom_css?: string
  callbacks?: Callback[]
}>

const CalendarFC: React.FC<Props> = ({
  args: { events, options, custom_css, callbacks },
}) => {
  const calendarRef = useRef<FullCalendar>(null)

  // Use a WeakMap to associate elements with their listeners
  const mouseEnterListeners = React.useRef(new WeakMap<HTMLElement, EventListener>()).current;

  // This is called by FullCalendar for each event after it is mounted
  const handleEventDidMount = (info: { event: EventApi; el: HTMLElement; view: ViewApi }) => {
    if (callbacks?.includes("eventMouseEnter")) {
      // Remove any previous listener to avoid duplicates
      const prevListener = mouseEnterListeners.get(info.el);
      if (prevListener) {
        info.el.removeEventListener("mouseenter", prevListener);
      }
    }
  }

  React.useEffect(() => {
    Streamlit.setFrameHeight()
  }, [])

  return (
    <FullCalendarWrapper $customCSS={custom_css}>
      <FullCalendar
        ref={calendarRef}
        plugins={ENABLED_PLUGINS}
        events={events}
        locale={ptBrLocale}
        eventDidMount={
          callbacks?.includes("eventMouseEnter") ? handleEventDidMount : undefined
        }
        {...options}
      />
    </FullCalendarWrapper>
  )
}

export default withStreamlitConnection(CalendarFC)
