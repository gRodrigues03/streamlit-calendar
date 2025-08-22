import os
import streamlit.components.v1 as components

parent_dir = os.path.dirname(os.path.abspath(__file__))
build_dir = os.path.join(parent_dir, "frontend/build")
_component_func = components.declare_component("calendar", path=build_dir)


def calendar(
    events=[],
    options={},
    custom_css="",
    callbacks=["dateClick", "eventClick", "eventChange", "eventsSet", "select"],
    key=None,
):
    """Create a new instance of "calendar".

    Parameters
    ----------
    events: event[]
        Array of event object. For complete event object properties,
        check out: https://fullcalendar.io/docs/event-object
    options: dict
        Dictionary of calendar options. For complete options,
        check out: https://fullcalendar.io/docs
    custom_css: string
        Custom CSS to customize the style of FullCalendar. For more information,
        check out: https://fullcalendar.io/docs/css-customization
    callbacks: str[]
        List of callback to enable. By default all 'dateClick', 'eventClick', 
        'eventChange', 'eventsSet', and 'select' are enabled.
        Set to empty list to disable all callbacks.
        List may contain 'dateClick', 'eventClick', 'eventChange', 'eventsSet',
        'select' and 'eventMouseEnter'.
    key: str or None
        An optional key that uniquely identifies this component. If this set to
        None, and the component's arguments are changed, the component will
        be re-mounted in the Streamlit frontend and lose its current state.

    Returns
    -------
    dict
        State value from dateClick, eventClick, eventChange, eventsSet
        select, and eventMouseEnter callbacks. 

    """
    component_value = _component_func(
        events=events,
        options=options,
        custom_css=custom_css,
        callbacks=callbacks,
        key=key,
        default={},
    )
    return component_value
