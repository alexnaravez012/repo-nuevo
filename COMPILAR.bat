rmdir /s /q "FrontTienda724" & (
	node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --prod --aot && (
		del FrontTienda724.zip & (
			zip -r FrontTienda724.zip FrontTienda724 & (
				pause
			)
		)
	) || (
	  pause
	)
)