import React, {
  useEffect,
  useRef,
  useState,
  MutableRefObject,
  useLayoutEffect,
  useMemo,
  isValidElement,
  forwardRef,
  Fragment,
  memo,
} from "react";
import type { FlashListProps, ViewToken } from "@shopify/flash-list";
import { useStableCallback } from "../hooks/useStableCallback";
import { debounce } from "tamagui";

const measurementsCache: any = {};

const DEFAULT_VIEWABILITY_THRESHOLD_PERCENTAGE = 80;
export const CellContainer = Fragment;

const renderComponent = (Component: any) => {
  if (!Component) return null;
  if (isValidElement(Component)) return Component;
  return <Component />;
};

function InfiniteScrollListImpl<Item>(
  props: FlashListProps<Item> & {
    useWindowScroll?: boolean;
    preserveScrollPosition?: boolean;
    overscan?: number;
    containerTw?: string;
  },
  ref: any,
) {
  const {
    data,
    renderItem,
    extraData,
    onViewableItemsChanged,
    pagingEnabled,
    viewabilityConfig,
    ItemSeparatorComponent,
    estimatedItemSize = 50,
    ListHeaderComponent,
    ListFooterComponent,
    ListEmptyComponent,
    onEndReached,
    initialScrollIndex,
    numColumns = 1,
    overscan,
    style,
    useWindowScroll = true,
    inverted,
    preserveScrollPosition = false,
    containerTw = "",
  } = props;
  let count = data?.length ?? 0;
  if (numColumns) {
    count = Math.ceil(count / numColumns);
  }

  const HeaderComponent = useMemo(
    () => renderComponent(ListHeaderComponent),
    [ListHeaderComponent],
  );
  const FooterComponent = useMemo(
    () => renderComponent(ListFooterComponent),
    [ListFooterComponent],
  );
  const EmptyComponent = useMemo(
    () => renderComponent(ListEmptyComponent),
    [ListEmptyComponent],
  );

  const viewableItems = useRef<ViewToken[]>([]);
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollMarginOffsetRef = useRef<HTMLDivElement>(null);
  const positionWasRestored = useRef<boolean>(false);

  const parentOffsetRef = useRef(0);
  const key = `cortex-scroll-restoration-window-scroll-${useWindowScroll}`;

  useLayoutEffect(() => {
    parentOffsetRef.current = scrollMarginOffsetRef.current?.offsetTop ?? 0;
  }, []);

  const [renderedItems, setRenderedItems] = useState<
    { index: number; start: number; end: number }[]
  >([]);

  const handleScroll = () => {
    const scrollElement = useWindowScroll ? document.documentElement : parentRef.current;
    if (!scrollElement) return;

    const scrollTop = scrollElement.scrollTop;
    const scrollHeight = scrollElement.scrollHeight;
    const clientHeight = scrollElement.clientHeight;

    const startIndex = Math.floor(scrollTop / estimatedItemSize);
    const endIndex = Math.min(
      Math.ceil((scrollTop + clientHeight) / estimatedItemSize),
      count - 1
    );

    const items: { index: number; start: number; end: number }[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        start: i * estimatedItemSize,
        end: (i + 1) * estimatedItemSize,
      });
    }
    setRenderedItems(items);
  };

  useEffect(() => {
    const eventTarget = useWindowScroll ? window : parentRef.current;
    if (!eventTarget) return;

    eventTarget.addEventListener("scroll", handleScroll);
    return () => {
      eventTarget.removeEventListener("scroll", handleScroll);
    };
  }, [useWindowScroll, estimatedItemSize, count]);

  useEffect(() => {
    handleScroll();
  }, [count]);

  useEffect(() => {
    handleScroll();
  }, []);

  const saveScrollPosition = useStableCallback(() => {
    if (parentRef.current) {
      sessionStorage.setItem(key, parentRef.current.scrollTop.toString());
    }
  });

  const saveWhenIdle = useStableCallback(() => {
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(saveScrollPosition);
    } else {
      saveScrollPosition();
    }
  });

  useEffect(() => {
    if (!preserveScrollPosition) return;

    const debouncedCallback = debounce(saveWhenIdle, 100);
    parentRef.current?.addEventListener("scroll", debouncedCallback);

    return () => {
      parentRef.current?.removeEventListener("scroll", debouncedCallback);
    };
  }, [preserveScrollPosition, saveWhenIdle]);

  const transformStyle = inverted ? { transform: "scaleY(-1)" } : {};

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const currentTarget = e.currentTarget as HTMLElement;

      if (currentTarget) {
        currentTarget.scrollTop -= e.deltaY;
      }
    };
    if (inverted) {
      parentRef.current?.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

    return () => {
      if (inverted) {
        parentRef.current?.removeEventListener("wheel", handleWheel);
      }
    };
  }, [inverted]);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasCalledOnEndReached = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasCalledOnEndReached.current) {
          onEndReached?.();
          hasCalledOnEndReached.current = true;
        }
      },
      {
        root: useWindowScroll ? null : parentRef.current,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [onEndReached, useWindowScroll]);

  useEffect(() => {
    hasCalledOnEndReached.current = false;
  }, [data]);

  return (
    <>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          ...transformStyle,
        }}
      >
        <div
          ref={(v) => {
            parentRef.current = v;
            if (ref) {
              ref.current = v;
            }
          }}
          className={containerTw}
          style={
            !useWindowScroll
              ? {
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                  overflowX: "hidden",
                  scrollbarGutter: "stable",
                  scrollbarWidth: "thin",
                  contain: "strict",
                  flexGrow: 1,
                  ...(style as React.CSSProperties || {}),
                  ...(pagingEnabled ? { scrollSnapType: "y mandatory" } : {}),
                }
              : {}
          }
        >
          <div style={transformStyle}>{HeaderComponent}</div>
          <div
            ref={scrollMarginOffsetRef}
            style={{
              height:
                count * estimatedItemSize === 0
                  ? "0%"
                  : count * estimatedItemSize -
                    (useWindowScroll ? 0 : parentOffsetRef.current),
              width: "100%",
              position: "relative",
              flex: 1,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                minHeight: count * estimatedItemSize === 0 ? "100%" : undefined,
                transform: `translateY(${renderedItems[0]?.start || 0}px)`,
              }}
            >
              {data?.length === 0 && EmptyComponent ? (
                <div
                  style={{
                    height: "100%",
                    position: "absolute",
                    inset: 0,
                    ...transformStyle,
                  }}
                >
                  {EmptyComponent}
                </div>
              ) : null}
              {renderedItems.map((virtualItem, idx) => {
                const index = virtualItem.index;
                const chunkItem = data?.slice(
                  index * numColumns,
                  index * numColumns + numColumns,
                );
                return (
                  <div
                    key={virtualItem.index}
                    data-index={index}
                    style={{
                      width: "100%",
                      ...transformStyle,
                      ...(pagingEnabled
                        ? {
                            scrollSnapAlign: "start",
                            scrollSnapStop: "always",
                          }
                        : {}),
                    }}
                  >
                    {chunkItem && chunkItem.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        {chunkItem.map((item, i) => {
                          const realIndex = index * numColumns + i;

                          return (
                            <ViewabilityTracker
                              key={realIndex}
                              index={realIndex}
                              item={item}
                              itemVisiblePercentThreshold={
                                viewabilityConfig?.itemVisiblePercentThreshold ??
                                DEFAULT_VIEWABILITY_THRESHOLD_PERCENTAGE
                              }
                              viewableItems={viewableItems}
                              onViewableItemsChanged={onViewableItemsChanged}
                            >
                              {renderItem?.({
                                index: realIndex,
                                item,
                                extraData,
                                target: "Cell",
                              }) ?? null}
                              {data && realIndex < data.length - 1 &&
                                renderComponent(ItemSeparatorComponent)}
                            </ViewabilityTracker>
                          );
                        })}
                      </div>
                    ) : null}
                    {idx === renderedItems.length - 1 && (
                      <div ref={sentinelRef} />
                    )}
                  </div>
                );
              })}
              {!useWindowScroll && FooterComponent ? (
                <div style={transformStyle}>{FooterComponent}</div>
              ) : null}
            </div>
          </div>

          {useWindowScroll && FooterComponent}
        </div>
      </div>
    </>
  );
}

const ViewabilityTracker = ({
  index,
  item,
  children,
  onViewableItemsChanged,
  viewableItems,
  itemVisiblePercentThreshold,
  ...rest
}: React.PropsWithChildren<{
  index: number;
  item: any;
  onViewableItemsChanged: FlashListProps<any>["onViewableItemsChanged"];
  viewableItems: MutableRefObject<ViewToken[]>;
  itemVisiblePercentThreshold: number;
}>) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    if (onViewableItemsChanged) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (
              viewableItems.current.findIndex((v) => v.index === index) === -1
            )
              viewableItems.current.push({
                item,
                index,
                isViewable: true,
                key: index.toString(),
                timestamp: new Date().valueOf(),
              });
          } else {
            viewableItems.current = viewableItems.current.filter(
              (v) => v.index !== index,
            );
          }

          viewableItems.current = viewableItems.current.sort(
            (a, b) => a.index - b.index,
          );

          onViewableItemsChanged?.({
            viewableItems: viewableItems.current,
            changed: [],
          });
        },
        {
          threshold: itemVisiblePercentThreshold / 100,
        },
      );

      if (ref.current) observer.observe(ref.current);
    }

    return () => {
      observer?.disconnect();
      viewableItems.current = viewableItems.current.filter(
        (v) => v.index !== index,
      );
    };
  }, [
    onViewableItemsChanged,
    viewableItems,
    index,
    item,
    itemVisiblePercentThreshold,
  ]);

  return (
    <div style={{ width: "100%" }} ref={ref} {...rest}>
      {children}
    </div>
  );
};

const InfiniteScrollList = memo(forwardRef(InfiniteScrollListImpl));

export { InfiniteScrollList };