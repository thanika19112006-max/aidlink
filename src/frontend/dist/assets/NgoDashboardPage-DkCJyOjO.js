import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, b as cn, d as useId, P as Primitive$1, e as composeEventHandlers, f as createContextScope$1, g as useComposedRefs, h as useControllableState, i as useCallbackRef, k as Presence, L as Link, B as Button, R as RefreshCw, Z as Zap } from "./index-DcnUVu1i.js";
import { c as createContextScope, A as Avatar, a as AvatarFallback } from "./avatar-SOaxMXER.js";
import { B as Badge } from "./badge-DuO1wzn1.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-g3b68mDS.js";
import { P as Primitive, u as ue } from "./index-C6-k6vU6.js";
import { S as Skeleton } from "./skeleton-Cw2iiXxy.js";
import { c as createCollection, u as useDirection, P as Plus, B as BookOpen, H as House } from "./index-B8AaBLuK.js";
import { u as useRequests, f as useAvailableVolunteers, g as useAssignments, a as useNGOs, h as useAssignVolunteer, R as RequestStatus, i as useUpdateRequestStatus, M as MapPin } from "./useAidLink-CJoAqCv4.js";
import { B as Building2 } from "./building-2-Dey0VxVA.js";
import { C as Clock } from "./clock-Bih1s0iF.js";
import { C as CircleCheck } from "./circle-check-q37aQC07.js";
import { T as TriangleAlert } from "./triangle-alert-CN8Hif3S.js";
import { T as TrendingUp, U as UserCheck } from "./user-check-DIGuV3wl.js";
import { A as Activity } from "./activity-CLK6nEc4.js";
import { U as Users } from "./users-COKJ8ZlA.js";
import { S as Star } from "./star-pAtvf4RH.js";
import { H as Heart } from "./heart-Ckcpc33h.js";
import { P as Package } from "./package-H8pHHr4P.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode);
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;
    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
    }
    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, "Progress"));
    }
    const value = isValidValueNumber(valueProp, max) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : void 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressProvider, { scope: __scopeProgress, value, max, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "aria-valuemax": max,
        "aria-valuemin": 0,
        "aria-valuenow": isNumber(value) ? value : void 0,
        "aria-valuetext": valueLabel,
        role: "progressbar",
        "data-state": getProgressState(value, max),
        "data-value": value ?? void 0,
        "data-max": max,
        ...progressProps,
        ref: forwardedRef
      }
    ) });
  }
);
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = "ProgressIndicator";
var ProgressIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": getProgressState(context.value, context.max),
        "data-value": context.value ?? void 0,
        "data-max": context.max,
        ...indicatorProps,
        ref: forwardedRef
      }
    );
  }
);
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(value, max) {
  return `${Math.round(value / max * 100)}%`;
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
  return typeof value === "number";
}
function isValidMaxNumber(max) {
  return isNumber(max) && !isNaN(max) && max > 0;
}
function isValidValueNumber(value, max) {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root$1 = Progress$1;
var Indicator = ProgressIndicator;
function Progress({
  className,
  value,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root$1,
    {
      "data-slot": "progress",
      className: cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "progress-indicator",
          className: "bg-primary h-full w-full flex-1 transition-all",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
    }
  );
}
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope$1(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive$1.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive$1.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope$1(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive$1.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive$1.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive$1.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive$1.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
const URGENCY_CONFIG = {
  critical: {
    label: "Critical",
    textColor: "text-red-400",
    badgeBg: "rgba(239,68,68,0.15)",
    dotColor: "#f87171"
  },
  high: {
    label: "High",
    textColor: "text-orange-400",
    badgeBg: "rgba(249,115,22,0.15)",
    dotColor: "#fb923c"
  },
  medium: {
    label: "Medium",
    textColor: "text-yellow-400",
    badgeBg: "rgba(234,179,8,0.15)",
    dotColor: "#facc15"
  },
  low: {
    label: "Low",
    textColor: "text-green-400",
    badgeBg: "rgba(34,197,94,0.15)",
    dotColor: "#4ade80"
  }
};
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "text-yellow-400",
    progress: 0,
    dotColor: "#facc15"
  },
  ongoing: {
    label: "In Progress",
    color: "text-blue-400",
    progress: 50,
    dotColor: "#60a5fa"
  },
  completed: {
    label: "Completed",
    color: "text-green-400",
    progress: 100,
    dotColor: "#4ade80"
  }
};
const RESOURCE_TYPE_CONFIG = {
  food: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-3 h-3" }),
    label: "Food",
    color: "rgba(249,115,22,0.2)"
  },
  medical: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-3 h-3" }),
    label: "Medical",
    color: "rgba(239,68,68,0.2)"
  },
  shelter: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-3 h-3" }),
    label: "Shelter",
    color: "rgba(59,130,246,0.2)"
  },
  education: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-3 h-3" }),
    label: "Education",
    color: "rgba(168,85,247,0.2)"
  },
  other: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" }),
    label: "Other",
    color: "rgba(107,114,128,0.2)"
  }
};
const MOCK_ACTIVITIES = [
  {
    id: 1,
    text: "Request #3 marked complete",
    sub: "Medical supplies delivered",
    color: "#4ade80",
    time: "2m ago"
  },
  {
    id: 2,
    text: "Volunteer Sarah assigned",
    sub: "To food distribution drive",
    color: "#60a5fa",
    time: "15m ago"
  },
  {
    id: 3,
    text: "New request submitted",
    sub: "Emergency shelter needed",
    color: "#facc15",
    time: "1h ago"
  },
  {
    id: 4,
    text: "Request #7 accepted",
    sub: "Education kit for 50 children",
    color: "#a78bfa",
    time: "3h ago"
  },
  {
    id: 5,
    text: "Impact milestone reached",
    sub: "500 beneficiaries served",
    color: "#fb923c",
    time: "Yesterday"
  }
];
function StatCard({
  icon,
  value,
  label,
  glowColor,
  isLoading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl p-5 border hover-lift relative overflow-hidden",
      style: {
        background: "rgba(20,24,50,0.5)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(255,255,255,0.08)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-8 translate-x-8",
            style: { background: glowColor },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-11 h-11 rounded-xl flex items-center justify-center mb-4",
            style: { background: `${glowColor}25` },
            children: icon
          }
        ),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16 mb-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-display font-bold text-3xl mb-1",
            style: { color: glowColor },
            children: value
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-sm", children: label })
      ]
    }
  );
}
function RequestCard({
  request,
  index,
  onAssign
}) {
  const { mutateAsync: updateStatus, isPending } = useUpdateRequestStatus();
  const urgency = URGENCY_CONFIG[request.urgency] ?? URGENCY_CONFIG.medium;
  const status = STATUS_CONFIG[request.status] ?? STATUS_CONFIG.pending;
  const resType = RESOURCE_TYPE_CONFIG[request.resourceType] ?? RESOURCE_TYPE_CONFIG.other;
  const markComplete = async () => {
    try {
      await updateStatus({
        requestId: request.id,
        status: RequestStatus.completed
      });
      ue.success("Request marked as completed.");
    } catch {
      ue.error("Failed to update status.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `ngo.requests.item.${index}`,
      className: "rounded-2xl p-5 border hover-lift",
      style: {
        background: "rgba(20,24,50,0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(255,255,255,0.07)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground truncate text-base", children: request.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1 line-clamp-2 leading-relaxed", children: request.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium border ${urgency.textColor}`,
              style: {
                background: urgency.badgeBg,
                borderColor: `${urgency.dotColor}40`
              },
              children: urgency.label
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full text-muted-foreground",
              style: { background: resType.color },
              children: [
                resType.icon,
                resType.label
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `flex items-center gap-1.5 text-xs font-medium ${status.color}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "w-2 h-2 rounded-full",
                    style: { background: status.dotColor }
                  }
                ),
                status.label
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
            request.lat.toFixed(2),
            "°, ",
            request.lng.toFixed(2),
            "°"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Qty: ",
            request.quantity.toString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Progress" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              status.progress,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: status.progress, className: "h-1.5" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              className: "text-xs h-7 flex-1 border-primary/30 text-primary hover:bg-primary/10",
              onClick: () => onAssign(request),
              "data-ocid": `ngo.requests.assign_button.${index}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3 mr-1" }),
                "Assign Volunteer"
              ]
            }
          ),
          request.status !== RequestStatus.completed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              className: "text-xs h-7 text-green-400 hover:bg-green-500/10",
              onClick: markComplete,
              disabled: isPending,
              "data-ocid": `ngo.requests.complete_button.${index}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 mr-1" }),
                "Complete"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function VolunteerRow({
  volunteer,
  index,
  onAssign,
  isAssigning
}) {
  const initials = volunteer.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const rating = Math.round(volunteer.rating);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `ngo.volunteer.item.${index}`,
      className: "flex items-center gap-3 py-3 border-b last:border-0",
      style: { borderColor: "rgba(255,255,255,0.06)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-9 h-9 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          AvatarFallback,
          {
            className: "text-xs font-semibold",
            style: { background: "rgba(99,102,241,0.3)", color: "#a5b4fc" },
            children: initials
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground truncate", children: volunteer.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 mt-0.5", children: volunteer.skills.slice(0, 2).map((skill) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs px-1.5 py-0.5 rounded text-muted-foreground",
              style: { background: "rgba(255,255,255,0.06)" },
              children: skill
            },
            skill
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5", children: [1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Star,
            {
              className: `w-2.5 h-2.5 ${s <= rating ? "text-yellow-400" : "text-muted"}`,
              fill: s <= rating ? "currentColor" : "none"
            },
            s
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              className: "text-xs h-6 px-2.5 border-accent/30 text-accent hover:bg-accent/10",
              onClick: () => onAssign(volunteer),
              disabled: isAssigning || !volunteer.isAvailable,
              "data-ocid": `ngo.volunteer.assign_button.${index}`,
              children: volunteer.isAvailable ? "Assign" : "Busy"
            }
          )
        ] })
      ]
    }
  );
}
function SkeletonCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl p-5 border",
      style: {
        background: "rgba(20,24,50,0.55)",
        borderColor: "rgba(255,255,255,0.07)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-5/6" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16 ml-3 rounded-full" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 rounded-full" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2 w-full rounded-full mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 flex-1 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-24 rounded" })
        ] })
      ]
    }
  );
}
function NgoDashboardPage() {
  const { data: requests = [], isLoading: reqLoading } = useRequests();
  const { data: availableVolunteers = [], isLoading: volLoading } = useAvailableVolunteers();
  const { data: assignments = [] } = useAssignments();
  const { data: ngos = [] } = useNGOs();
  const assignVolunteer = useAssignVolunteer();
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [assignDialogOpen, setAssignDialogOpen] = reactExports.useState(false);
  const [selectedRequest, setSelectedRequest] = reactExports.useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = reactExports.useState(
    null
  );
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);
  const pending = requests.filter((r) => r.status === RequestStatus.pending);
  const ongoing = requests.filter((r) => r.status === RequestStatus.ongoing);
  const completed = requests.filter(
    (r) => r.status === RequestStatus.completed
  );
  const completionRate = requests.length > 0 ? Math.round(completed.length / requests.length * 100) : 0;
  const filteredRequests = activeTab === "all" ? requests : activeTab === "pending" ? pending : activeTab === "ongoing" ? ongoing : completed;
  const openAssignDialog = (req) => {
    setSelectedRequest(req);
    setSelectedVolunteer(null);
    setAssignDialogOpen(true);
  };
  const handleAssignVolunteer = (v) => {
    if (selectedRequest) {
      openAssignDialog(selectedRequest);
    }
    setSelectedVolunteer(v);
  };
  const confirmAssignment = async () => {
    if (!selectedRequest || !selectedVolunteer) return;
    try {
      await assignVolunteer.mutateAsync({
        requestId: selectedRequest.id,
        volunteerId: selectedVolunteer.id
      });
      ue.success(
        `${selectedVolunteer.name} assigned to "${selectedRequest.title}"`
      );
      setAssignDialogOpen(false);
    } catch {
      ue.error("Failed to assign volunteer. Please try again.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen",
      style: {
        background: "linear-gradient(135deg, #050a1a 0%, #080d20 40%, #0a0e28 70%, #070b1f 100%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease"
      },
      "data-ocid": "ngo.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none",
            style: {
              background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed bottom-20 right-1/4 w-80 h-80 rounded-full pointer-events-none",
            style: {
              background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-7xl px-4 py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-2xl p-6 mb-8 border relative overflow-hidden",
              style: {
                background: "rgba(15,20,45,0.7)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderColor: "rgba(99,102,241,0.2)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute inset-0 opacity-5 pointer-events-none",
                    style: {
                      backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                      backgroundSize: "40px 40px"
                    },
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-8 h-8 rounded-lg flex items-center justify-center",
                          style: { background: "rgba(99,102,241,0.25)" },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-4 h-4 text-primary" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-sm font-medium tracking-wide uppercase", children: "NGO Command Center" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h1",
                      {
                        className: "font-display font-bold text-3xl sm:text-4xl bg-clip-text text-transparent",
                        style: {
                          backgroundImage: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #67e8f9 100%)"
                        },
                        children: "NGO Dashboard"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1.5", children: "Manage your resource requests and volunteer assignments" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/request", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      className: "h-10 px-5 font-semibold border-0",
                      style: {
                        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        boxShadow: "0 0 20px rgba(99,102,241,0.4)"
                      },
                      "data-ocid": "ngo.create_request.button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
                        "New Request"
                      ]
                    }
                  ) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5", style: { color: "#818cf8" } }),
                value: requests.length,
                label: "Total Requests",
                glowColor: "#6366f1",
                isLoading: reqLoading
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-yellow-400" }),
                value: pending.length,
                label: "Pending",
                glowColor: "#eab308",
                isLoading: reqLoading
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-5 h-5 text-blue-400" }),
                value: ongoing.length,
                label: "In Progress",
                glowColor: "#3b82f6",
                isLoading: reqLoading
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-green-400" }),
                value: completed.length,
                label: "Completed",
                glowColor: "#22c55e",
                isLoading: reqLoading
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-lg text-foreground", children: "Resource Requests" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-xs border-border text-muted-foreground",
                    children: [
                      requests.length,
                      " total"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Tabs,
                {
                  value: activeTab,
                  onValueChange: setActiveTab,
                  "data-ocid": "ngo.requests.tabs",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      TabsList,
                      {
                        className: "w-full mb-4",
                        style: {
                          background: "rgba(15,20,45,0.6)",
                          backdropFilter: "blur(12px)",
                          WebkitBackdropFilter: "blur(12px)",
                          borderColor: "rgba(255,255,255,0.08)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            TabsTrigger,
                            {
                              value: "all",
                              className: "flex-1 text-xs",
                              "data-ocid": "ngo.requests.all.tab",
                              children: [
                                "All (",
                                requests.length,
                                ")"
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            TabsTrigger,
                            {
                              value: "pending",
                              className: "flex-1 text-xs",
                              "data-ocid": "ngo.requests.pending.tab",
                              children: [
                                "Pending (",
                                pending.length,
                                ")"
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            TabsTrigger,
                            {
                              value: "ongoing",
                              className: "flex-1 text-xs",
                              "data-ocid": "ngo.requests.ongoing.tab",
                              children: [
                                "Ongoing (",
                                ongoing.length,
                                ")"
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            TabsTrigger,
                            {
                              value: "completed",
                              className: "flex-1 text-xs",
                              "data-ocid": "ngo.requests.completed.tab",
                              children: [
                                "Done (",
                                completed.length,
                                ")"
                              ]
                            }
                          )
                        ]
                      }
                    ),
                    [
                      "all",
                      RequestStatus.pending,
                      RequestStatus.ongoing,
                      RequestStatus.completed
                    ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: tab, children: reqLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, i)) }) : filteredRequests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "rounded-2xl p-10 text-center border",
                        style: {
                          background: "rgba(15,20,45,0.55)",
                          backdropFilter: "blur(16px)",
                          WebkitBackdropFilter: "blur(16px)",
                          borderColor: "rgba(255,255,255,0.07)"
                        },
                        "data-ocid": "ngo.requests.empty_state",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-10 h-10 text-muted-foreground mx-auto mb-3" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "No requests here yet. Create your first one!" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/request", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Button,
                            {
                              type: "button",
                              size: "sm",
                              className: "border-0",
                              style: {
                                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                              },
                              "data-ocid": "ngo.requests.create_button",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 mr-1" }),
                                " Create Request"
                              ]
                            }
                          ) })
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 xl:grid-cols-2 gap-4 items-start", children: filteredRequests.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      RequestCard,
                      {
                        request: r,
                        index: i + 1,
                        onAssign: openAssignDialog
                      },
                      r.id.toString()
                    )) }) }, tab))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-2xl p-5 border",
                  style: {
                    background: "rgba(15,20,45,0.65)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderColor: "rgba(255,255,255,0.08)"
                  },
                  "data-ocid": "ngo.impact.panel",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-primary" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-sm", children: "Impact Summary" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mb-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Completion Rate" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-green-400", children: [
                            completionRate,
                            "%"
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: completionRate, className: "h-2" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "rounded-xl p-3 text-center border",
                            style: {
                              background: "rgba(99,102,241,0.1)",
                              borderColor: "rgba(99,102,241,0.2)"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-2xl text-primary", children: assignments.length }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: "Assignments" })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "rounded-xl p-3 text-center border",
                            style: {
                              background: "rgba(168,85,247,0.1)",
                              borderColor: "rgba(168,85,247,0.2)"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-2xl text-accent", children: ngos.length }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: "Partner NGOs" })
                            ]
                          }
                        )
                      ] })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-2xl p-5 border",
                  style: {
                    background: "rgba(15,20,45,0.65)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderColor: "rgba(255,255,255,0.08)"
                  },
                  "data-ocid": "ngo.volunteers.panel",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-4 h-4 text-accent" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-sm", children: "Available Volunteers" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Badge,
                        {
                          variant: "outline",
                          className: "text-xs border-green-500/30 text-green-400",
                          children: [
                            availableVolunteers.length,
                            " ready"
                          ]
                        }
                      )
                    ] }),
                    volLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-full" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-3/4" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
                      ] })
                    ] }, i)) }) : availableVolunteers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-muted-foreground text-sm text-center py-4",
                        "data-ocid": "ngo.volunteers.empty_state",
                        children: "No volunteers available right now."
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: availableVolunteers.slice(0, 5).map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      VolunteerRow,
                      {
                        volunteer: v,
                        index: i + 1,
                        onAssign: handleAssignVolunteer,
                        isAssigning: assignVolunteer.isPending
                      },
                      v.id.toString()
                    )) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-2xl p-5 border",
                  style: {
                    background: "rgba(15,20,45,0.65)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    borderColor: "rgba(255,255,255,0.08)"
                  },
                  "data-ocid": "ngo.activity.panel",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4 text-blue-400" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-sm", children: "Recent Activity" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: MOCK_ACTIVITIES.map((activity, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex gap-3",
                        "data-ocid": `ngo.activity.item.${i + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1",
                                style: { background: activity.color }
                              }
                            ),
                            i < MOCK_ACTIVITIES.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "w-px flex-1 mt-1",
                                style: {
                                  background: "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)",
                                  minHeight: "16px"
                                }
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 pb-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium leading-tight", children: activity.text }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: activity.sub }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mt-1", children: activity.time })
                          ] })
                        ]
                      },
                      activity.id
                    )) })
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dialog,
          {
            open: assignDialogOpen,
            onOpenChange: setAssignDialogOpen,
            "data-ocid": "ngo.assign.dialog",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DialogContent,
              {
                className: "max-w-md border",
                style: {
                  background: "rgba(12,16,40,0.97)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  borderColor: "rgba(99,102,241,0.25)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-foreground", children: "Assign Volunteer" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-muted-foreground text-sm", children: selectedRequest ? `Select a volunteer for "${selectedRequest.title}"` : "Choose a volunteer to assign to this request." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto pr-1", children: availableVolunteers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm text-center py-6", children: "No available volunteers at this time." }) : availableVolunteers.map((v) => {
                    const initials = v.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                    const isSelected = (selectedVolunteer == null ? void 0 : selectedVolunteer.id) === v.id;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "w-full flex items-center gap-3 p-3 rounded-xl border transition-smooth text-left",
                        style: {
                          background: isSelected ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
                          borderColor: isSelected ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)"
                        },
                        onClick: () => setSelectedVolunteer(v),
                        "data-ocid": `ngo.assign.volunteer.${v.id}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-8 h-8 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            AvatarFallback,
                            {
                              className: "text-xs font-semibold",
                              style: {
                                background: "rgba(99,102,241,0.3)",
                                color: "#a5b4fc"
                              },
                              children: initials
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground", children: v.name }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mt-0.5 flex-wrap", children: v.skills.slice(0, 3).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "text-xs text-muted-foreground px-1.5 py-0.5 rounded",
                                style: { background: "rgba(255,255,255,0.06)" },
                                children: s
                              },
                              s
                            )) })
                          ] }),
                          isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary flex-shrink-0" })
                        ]
                      },
                      v.id.toString()
                    );
                  }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        className: "flex-1 border-border text-muted-foreground",
                        onClick: () => setAssignDialogOpen(false),
                        "data-ocid": "ngo.assign.cancel_button",
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        className: "flex-1 border-0",
                        style: {
                          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                          boxShadow: selectedVolunteer ? "0 0 16px rgba(99,102,241,0.35)" : "none"
                        },
                        disabled: !selectedVolunteer || assignVolunteer.isPending,
                        onClick: confirmAssignment,
                        "data-ocid": "ngo.assign.confirm_button",
                        children: assignVolunteer.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : "Confirm Assignment"
                      }
                    )
                  ] })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
export {
  NgoDashboardPage
};
